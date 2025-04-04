# Filament EditorJS

[![Latest Version on Packagist](https://img.shields.io/packagist/v/athphane/filament-editorjs.svg?style=flat-square)](https://packagist.org/packages/athphane/filament-editorjs)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/athphane/filament-editorjs/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/athphane/filament-editorjs/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/athphane/filament-editorjs/fix-php-code-styling.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/athphane/filament-editorjs/actions?query=workflow%3A"Fix+PHP+code+styling"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/athphane/filament-editorjs.svg?style=flat-square)](https://packagist.org/packages/athphane/filament-editorjs)

An EditorJS field for Filament v3, with integrated image uploads using Spatie's Media Library package and `filament/spatie-laravel-media-library-plugin`.

![img.png](assets/img.png)

## Requirements

- PHP 8.3+
- Laravel 11.x+
- Filament 3.2+
- Spatie Media Library 11.9+
- `filament/spatie-laravel-media-library-plugin` 3.3+

## Installation

You can install the package via composer:

```bash
composer require athphane/filament-editorjs
```

Optionally, you can publish the config file with:

```bash
php artisan vendor:publish --tag="filament-editorjs-config"
```

Alternatively, you can run the install command:

```bash
php artisan filament-editorjs:install
```

This command will publish the configuration file and ask you to star the repository on GitHub.

This is the contents of the published config file (`config/filament-editorjs.php`):

```php
return [
    /**
     * The profiles to use for the editorjs field.
     * The default profile is the default_profile from the config.
     */
    'profiles' => [
        'default' => [
            'header', 'image', 'delimiter', 'list', 'underline', 'quote', 'table',
        ],
        'pro' => [
            'header', 'image', 'delimiter', 'list', 'underline', 'quote', 'table',
            'raw', 'code', 'inline-code', 'style',
        ],
    ],

    /**
     * The default profile to use for the editorjs field.
     */
    'default_profile' => 'default',

    /**
     * The allowed image mime types for the editorjs field.
     */
    'image_mime_types' => [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/tiff',
        'image/x-citrix-png',
        'image/x-png',
        'image/svg+xml',
        'image/svg',
    ],
];
```

## Usage

This package requires Spatie's Media Library package to be installed and configured. Please follow the installation instructions for [spatie/laravel-medialibrary](https://spatie.be/docs/laravel-medialibrary/v11/installation-setup) and [filament/spatie-laravel-media-library-plugin](https://filamentphp.com/plugins/spatie-media-library) if you haven't already.

### Setting up models

First, you need a place to store the EditorJS content. This package assumes you have a NULLABLE `content` column of type `JSON` in your database table.

Your model must implement the `Spatie\MediaLibrary\HasMedia` interface and use the `Spatie\MediaLibrary\InteractsWithMedia` trait.

Next, you must use this package's `Athphane\FilamentEditorjs\Traits\ModelHasEditorJsComponent` trait in your model. This trait provides helper methods for integrating with the EditorJS field.

```php
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Athphane\FilamentEditorjs\Traits\ModelHasEditorJsComponent;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class YourModel extends Model implements HasMedia
{
    use InteractsWithMedia;
    use ModelHasEditorJsComponent; // Add this trait

    protected $casts = [
        'content' => 'array', // Cast the content field to array
    ];

    // ... other model properties and methods

    /**
     * Register the media collections needed for the editorjs field.
     */
    public function registerMediaCollections(): void
    {
        // Call the helper method from the trait
        $this->registerEditorJsMediaCollections();

        // You can add other media collections here if needed
    }

    /**
     * Register the media conversions needed for the editorjs field.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        // Call the helper method from the trait
        $this->registerEditorJsMediaConversions($media);

        // You can add other media conversions here if needed
    }
}
```

#### Changing the default column name for the content field
The package assumes you use a column named `content`. If you want to use a different name (e.g., `body_json`), override the `editorJsContentFieldName` method in your model:

```php
public function editorJsContentFieldName(): string
{
    return 'body_json'; // Return your custom column name
}
```

Don't forget to update the `$casts` property accordingly.

#### Settings up allowed mime types for the editorjs media collection
By default, the allowed mime types are taken from the `filament-editorjs.php` config file. You can override this per model when calling `registerEditorJsMediaCollections`:

```php
public function registerMediaCollections(): void
{
    $this->registerEditorJsMediaCollections(mime_types: [
        'image/jpeg',
        'image/png',
    ]);
}
````

#### Enabling/Disabling responsive images generation
Responsive images are generated by default. You can disable this by passing `false` to the `registerEditorJsMediaCollections` method:

```php
public function registerMediaCollections(): void
{
    $this->registerEditorJsMediaCollections(generate_responsive_images: false);
}
```

#### Modifying the default media collection name
The default media collection name is `content_images`. To change this, override the `editorjsMediaCollectionName` method in your model:

```php
public function editorjsMediaCollectionName(): string
{
    return 'editor_uploads'; // Return your custom collection name
}
```

### Setting up the editorjs field in your Filament Resource

Use the `Athphane\FilamentEditorjs\Forms\Components\EditorjsTextField` component in your form definition:

```php
use Athphane\FilamentEditorjs\Forms\Components\EditorjsTextField;
use Filament\Forms\Form;

public static function form(Form $form): Form
{
    return $form
        ->schema([
            // ... other fields
            EditorjsTextField::make('content') // Use the same name as your database column
                ->columnSpanFull()
                ->profile('default') // Optional: specify a tool profile from config
                ->minHeight(150), // Optional: set minimum height
        ]);
}
```

## Testing

```bash
composer test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [athphane](https://github.com/athphane)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
