<?php

namespace App\Http\Requests;

use App\Rules\IsbnValido;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $bookId = $this->route('book')?->id ?? ($this->route('book') ?? ($this->route('livro')?->id ?? $this->route('livro')));

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'isbn' => ['sometimes', 'required', 'string', Rule::unique('book', 'isbn')->ignore($bookId), new IsbnValido()],
            'year' => ['nullable', 'integer', 'min:1000', 'max:' . (date('Y') + 1)],
            'synopsis' => ['nullable', 'string'],
            'amount' => ['nullable', 'integer', 'min:0'],
            'author_id' => ['sometimes', 'required', 'exists:author,id'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['exists:category,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'isbn.unique' => 'Já existe um livro cadastrado com este ISBN.',
            'author_id.exists' => 'Selecione um autor válido existente.',
        ];
    }
}
