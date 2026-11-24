<?php

namespace App\Http\Requests;

use App\Rules\IsbnValido;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];

        if ($this->filled("author") && !$this->filled("author_name") && !$this->filled("author_id")) {
            $merge["author_name"] = trim((string) $this->input("author"));
        }

        if ($this->filled("publicationDate") && !$this->filled("year")) {
            if (preg_match('/(\d{4})/', (string) $this->input("publicationDate"), $m)) {
                $merge["year"] = (int) $m[1];
            }
        }

        if ($this->filled("isbn")) {
            $merge["isbn"] = preg_replace('/[-\s]/', '', (string) $this->input("isbn"));
        }

        if (!$this->filled("amount")) {
            $merge["amount"] = 1;
        }

        if (!empty($merge)) {
            $this->merge($merge);
        }
    }

    public function rules(): array
    {
        return [
            "title" => ["required", "string", "max:255"],
            "isbn" => [
                "required",
                "string",
                "unique:book,isbn",
                new IsbnValido(),
            ],
            "year" => [
                "nullable",
                "integer",
                "min:1000",
                "max:" . (date("Y") + 1),
            ],
            "synopsis" => ["nullable", "string"],
            "amount" => ["nullable", "integer", "min:1"],
            "author_id" => [
                "required_without:author_name",
                "nullable",
                "exists:author,id",
            ],
            "author_name" => [
                "required_without:author_id",
                "nullable",
                "string",
                "max:255",
            ],
            "category" => ["nullable", "string", "max:255"],
            "categories" => ["nullable", "array"],
            "categories.*" => ["exists:category,id"],
        ];
    }

    public function messages(): array
    {
        return [
            "title.required" => "O título do livro é obrigatório.",
            "isbn.required" => "O ISBN é obrigatório.",
            "isbn.unique" => "Já existe um livro cadastrado com este ISBN.",
            "author_id.required" => "O autor é obrigatório.",
            "author_id.exists" => "Selecione um autor válido existente.",
            "categories.*.exists" => "Uma ou mais categorias informadas não existem.",
        ];
    }
}
