<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DevolucaoController;
use App\Http\Controllers\Api\IntegracaoLivroController;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix("v1")->group(function () {
    Route::get("livros/externo/isbn/{isbn}", [
        IntegracaoLivroController::class,
        "buscarPorIsbn",
    ]);
    Route::get("livros/externo/buscar", [
        IntegracaoLivroController::class,
        "buscarPorTexto",
    ]);
    Route::post("livros/externo/importar", [
        IntegracaoLivroController::class,
        "importar",
    ]);
    Route::post("register", [AuthController::class, "register"]);
    Route::post("login", [AuthController::class, "login"]);
    Route::post("logout", [AuthController::class, "logout"]);
    Route::get("me", [AuthController::class, "me"]);

    // English resources
    Route::apiResource("authors", AuthorController::class);
    Route::apiResource("categories", CategoryController::class);
    Route::get("inventory/metrics", [BookController::class, "metricasInventario"]);
    Route::apiResource("books", BookController::class);
    Route::apiResource("users", UserController::class);
    Route::apiResource("loans", LoanController::class)->only([
        "index",
        "store",
        "show",
    ]);
    Route::patch("loans/{loan}/return", DevolucaoController::class);

    // Front compatibility aliases
    Route::apiResource("autores", AuthorController::class);
    Route::apiResource("categorias", CategoryController::class);
    Route::get("inventario/metricas", [BookController::class, "metricasInventario"]);
    Route::apiResource("livros", BookController::class);
    Route::apiResource("usuarios", UserController::class);
    Route::apiResource("emprestimos", LoanController::class)->only([
        "index",
        "store",
        "show",
    ]);
    Route::patch("emprestimos/{emprestimo}/devolucao", DevolucaoController::class);
});
