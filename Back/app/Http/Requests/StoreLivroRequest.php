<?php

namespace App\Http\Requests;

use App\Rules\IsbnValido;
use Illuminate\Foundation\Http\FormRequest;

class StoreLivroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "titulo" => ["required", "string", "max:255"],
            "isbn" => [
                "required",
                "string",
                "unique:livros,isbn",
                new IsbnValido(),
            ],
            "ano_publicacao" => [
                "nullable",
                "integer",
                "min:1000",
                "max:" . (date("Y") + 1),
            ],
            "sinopse" => ["nullable", "string"],
            "capa_url" => ["nullable", "url", "max:500"],
            "quantidade" => ["nullable", "integer", "min:1"],
            "autor_id" => [
                "required_without:autor_nome",
                "nullable",
                "exists:autores,id",
            ],
            "autor_nome" => [
                "required_without:autor_id",
                "nullable",
                "string",
                "max:255",
            ],
            "categorias" => ["nullable", "array"],
            "categorias.*" => ["exists:categorias,id"],
        ];
    }

    public function messages(): array
    {
        return [
            "titulo.required" => "O título do livro é obrigatório.",
            "isbn.required" => "O ISBN é obrigatório.",
            "isbn.unique" => "Já existe um livro cadastrado com este ISBN.",
            "autor_id.required" => "O autor é obrigatório.",
            "autor_id.exists" => "Selecione um autor válido existente.",
            "categorias.*.exists" =>
                "Uma ou mais categorias informadas não existem.",
        ];
    }
}
