<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\AdditionalInformation;
use App\Models\CareerCategory;
use App\Models\Company;
use App\Models\ContactMessage;
use App\Models\ForumReply;
use App\Models\ForumTopic;
use App\Models\JobApplication;
use App\Models\JobPosting;
use App\Models\Paper;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $isSuperAdmin = $user->hasRole('SuperAdmin');

        return inertia('dashboard', [
            'stats' => $isSuperAdmin ? $this->superAdminStats() : null,
            'profileIncomplete' => $user->hasRole('Cientifico') && ! $user->hasCompleteProfessionalProfile(),
            'companyStats' => $user->hasRole('Empresa') && $user->company ? $this->companyStats($user->company) : null,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function companyStats(Company $company): array
    {
        $applications = JobApplication::query()->whereHas('jobPosting', fn ($query) => $query->where('company_id', $company->id));

        $byJob = JobPosting::query()
            ->where('company_id', $company->id)
            ->withCount('applications')
            ->orderByDesc('applications_count')
            ->limit(6)
            ->get()
            ->map(fn (JobPosting $job) => ['label' => $job->title, 'total' => $job->applications_count])
            ->values();

        $byStatus = collect(JobApplication::STATUSES)->map(fn (string $label, string $status) => [
            'label' => $label,
            'total' => (clone $applications)->where('status', $status)->count(),
        ])->values();

        $byLevel = AdditionalInformation::query()
            ->whereIn('user_id', (clone $applications)->select('user_id'))
            ->whereNotNull('postgrad_level')
            ->select('postgrad_level', DB::raw('count(*) as total'))
            ->groupBy('postgrad_level')
            ->get()
            ->map(fn ($row) => ['label' => AdditionalInformation::POSTGRAD_LEVELS[$row->postgrad_level] ?? $row->postgrad_level, 'total' => (int) $row->total])
            ->values();

        $recent = (clone $applications)
            ->with(['user:id,name', 'jobPosting:id,title', 'user.additionalInformation:id,user_id,profession'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (JobApplication $application) => [
                'id' => $application->id,
                'name' => $application->user->name,
                'profession' => $application->user->additionalInformation?->profession,
                'job' => $application->jobPosting->title,
                'job_id' => $application->job_posting_id,
                'created_at' => $application->created_at,
            ]);

        return [
            'totalApplicants' => (clone $applications)->distinct()->count('user_id'),
            'totalApplications' => (clone $applications)->count(),
            'newApplications' => (clone $applications)->where('status', 'recibida')->count(),
            'jobsCount' => $company->jobPostings()->count(),
            'byJob' => $byJob,
            'byStatus' => $byStatus,
            'byLevel' => $byLevel,
            'recent' => $recent,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function superAdminStats(): array
    {
        $totalUsers = User::count();

        $usersByRole = DB::table('model_has_roles')
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('model_has_roles.model_type', User::class)
            ->select('roles.name as label', DB::raw('count(*) as total'))
            ->groupBy('roles.name')
            ->orderByDesc('total')
            ->get();

        $usersByArea = CareerCategory::query()
            ->select('career_categories.id', 'career_categories.name')
            ->selectRaw('(select count(*) from users join careers on careers.id = users.career_id where careers.career_category_id = career_categories.id) as total')
            ->get()
            ->map(fn (CareerCategory $category) => ['label' => $category->name, 'total' => (int) $category->total])
            ->filter(fn (array $row) => $row['total'] > 0)
            ->sortByDesc('total')
            ->values();

        $usersWithoutArea = User::whereNull('career_id')->count();

        $months = collect(range(5, 0))->map(fn (int $ago) => Carbon::now()->startOfMonth()->subMonths($ago));
        $registrations = User::query()
            ->where('created_at', '>=', $months->first())
            ->pluck('created_at')
            ->countBy(fn ($date) => Carbon::parse($date)->format('Y-m'));

        $registrationsByMonth = $months->map(fn (Carbon $month) => [
            'label' => $month->translatedFormat('M Y'),
            'total' => $registrations->get($month->format('Y-m'), 0),
        ])->values();

        return [
            'totals' => [
                'users' => $totalUsers,
                'verified' => User::whereNotNull('email_verified_at')->count(),
                'newThisMonth' => User::where('created_at', '>=', Carbon::now()->startOfMonth())->count(),
                'jobs' => JobPosting::where('status', 'publicado')->count(),
                'activities' => Activity::where('status', 'publicado')->count(),
                'topics' => ForumTopic::where('status', 'publicado')->count(),
                'replies' => ForumReply::count(),
                'papers' => Paper::count(),
            ],
            'pending' => [
                'activities' => Activity::where('status', 'en_revision')->count(),
                'topics' => ForumTopic::where('status', 'en_revision')->count(),
                'jobs' => JobPosting::where('status', 'pendiente')->count(),
                'messages' => ContactMessage::count(),
            ],
            'usersByRole' => $usersByRole,
            'usersByArea' => $usersByArea,
            'usersWithoutArea' => $usersWithoutArea,
            'registrationsByMonth' => $registrationsByMonth,
            'jobsByArea' => CareerCategory::query()
                ->select('career_categories.id', 'career_categories.name')
                ->selectRaw("(select count(*) from job_postings where job_postings.category_id = career_categories.id and job_postings.status = 'publicado') as total")
                ->get()
                ->map(fn (CareerCategory $category) => ['label' => $category->name, 'total' => (int) $category->total])
                ->filter(fn (array $row) => $row['total'] > 0)
                ->sortByDesc('total')
                ->values(),
        ];
    }
}
