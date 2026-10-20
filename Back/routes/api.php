<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IntegracaoLivroController;

use App\Http\Controllers\Api\AutorController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\DevolucaoController;
use App\Http\Controllers\Api\EmprestimoController;
use App\Http\Controllers\Api\LivroController;
use App\Http\Controllers\Api\UsuarioController;
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
    Route::apiResource("autores", AutorController::class);
    Route::apiResource("categorias", CategoriaController::class);
    Route::get("inventario/metricas", [LivroController::class, "metricasInventario"]);
    Route::apiResource("livros", LivroController::class);
    Route::apiResource("usuarios", UsuarioController::class);
    Route::apiResource("emprestimos", EmprestimoController::class)->only([
        "index",
        "store",
        "show",
    ]);
    Route::patch(
        "emprestimos/{emprestimo}/devolucao",
        DevolucaoController::class,
    );
});
