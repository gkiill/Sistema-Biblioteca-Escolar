<?php

namespace App\Http\Requests;

use App\Rules\IsbnValido;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLivroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $livroId = $this->route('livro')?->id ?? $this->route('livro');

        return [
            'titulo' => ['sometimes', 'required', 'string', 'max:255'],
            'isbn' => ['sometimes', 'required', 'string', Rule::unique('livros', 'isbn')->ignore($livroId), new IsbnValido()],
            'ano_publicacao' => ['nullable', 'integer', 'min:1000', 'max:' . (date('Y') + 1)],
            'sinopse' => ['nullable', 'string'],
            'capa_url' => ['nullable', 'url', 'max:500'],
            'quantidade' => ['nullable', 'integer', 'min:0'],
            'autor_id' => ['sometimes', 'required', 'exists:autores,id'],
            'categorias' => ['nullable', 'array'],
            'categorias.*' => ['exists:categorias,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'isbn.unique' => 'Já existe um livro cadastrado com este ISBN.',
            'autor_id.exists' => 'Selecione um autor válido existente.',
        ];
    }
}