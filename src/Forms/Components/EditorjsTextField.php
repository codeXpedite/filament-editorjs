<?php

namespace Athphane\FilamentEditorjs\Forms\Components;

use Athphane\FilamentEditorjs\Forms\Concerns\HasHeight;
use Athphane\FilamentEditorjs\Forms\Concerns\HasTools;
use Filament\Forms\Components\Field;
use Filament\Support\Concerns\HasPlaceholder;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;

class EditorjsTextField extends Field
{
    use HasHeight;
    use HasPlaceholder;
    use HasTools;

    protected string $view = 'filament-editorjs::components.editorjs-text-field';

    public static function make(string $name): static
    {
        $instance = parent::make($name);

        // Setup Default Tools from Config
        $instance = $instance->setDefaultTools();

        return $instance;
    }

    /**
     * Livewire action to process the temporary file uploaded by Editor.js
     *
     * @throws FileDoesNotExist
     * @throws FileIsTooBig
     */
    public function processEditorJsImageUpload(string $statePath, TemporaryUploadedFile $file): array
    {
        $record = $this->getRecord();

        if (! $record || ! method_exists($record, 'editorJsSaveImageFromDisk')) {
            // Handle cases where record is not found or doesn't have the required trait/method
            return [
                'success' => 0,
                'message' => 'Record not found or method editorJsSaveImageFromDisk missing.'
            ];
        }

        /** @var \Spatie\MediaLibrary\MediaCollections\Models\Media $media */
        $media = $record->editorJsSaveImageFromDisk($file, $this->getName()); // Pass field name if needed

        return [
            'success' => 1,
            'file'    => [
                'url'      => $media->getUrl('preview'), // Assuming 'preview' conversion exists
                'media_id' => $media->id,
            ],
        ];
    }
}
