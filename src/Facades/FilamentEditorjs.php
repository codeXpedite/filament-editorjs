<?php

namespace Athphane\FilamentEditorjs\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Athphane\FilamentEditorjs\FilamentEditorjs
 */
class FilamentEditorjs extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \Athphane\FilamentEditorjs\FilamentEditorjs::class;
    }
}
