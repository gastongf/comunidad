<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function create(): Response
    {
        return inertia('contacto/index');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:180'],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
        ]);

        ContactMessage::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Mensaje enviado. Te responderemos pronto.']);

        return redirect()->route('contacto.create');
    }

    public function index(): Response
    {
        return inertia('mensajes-contacto/index', [
            'mensajes' => ContactMessage::query()->latest()->paginate(10),
        ]);
    }
}
