<?php

namespace App\Http\Controllers;

use App\Models\AdditionalInformation;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CvDownloadController extends Controller
{
    /**
     * The CV is private: only its owner, administrators, or a company that received an application from the owner.
     */
    public function __invoke(Request $request, AdditionalInformation $additionalInformation): StreamedResponse
    {
        $user = $request->user();
        $company = $user->company;

        $allowed = $user->id === $additionalInformation->user_id
            || $user->hasAnyRole(['SuperAdmin', 'Administrador'])
            || ($company !== null && JobApplication::query()
                ->where('user_id', $additionalInformation->user_id)
                ->whereHas('jobPosting', fn ($query) => $query->where('company_id', $company->id))
                ->exists());

        abort_unless($allowed && filled($additionalInformation->cv_path), 403);
        abort_unless(Storage::disk('local')->exists($additionalInformation->cv_path), 404);

        $ownerName = Str::slug($additionalInformation->user->name);

        return Storage::disk('local')->download($additionalInformation->cv_path, 'cv-'.$ownerName.'.pdf');
    }
}
