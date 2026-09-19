import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const METRIC_SKELETON_IDS = ["payments", "refunds", "events", "providers"];

const PANEL_SKELETON_IDS = ["activity", "operations"];

function DashboardSkeleton({ className }: { className?: string }) {
	return (
		<div className={cn("space-y-6", className)} aria-label="Loading dashboard" aria-busy="true">
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{METRIC_SKELETON_IDS.map((id) => (
					<div key={id} className="rounded-xl border border-white/[0.07] bg-[#1b1b1b] p-5">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="mt-6 h-7 w-20" />
					</div>
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-2">
				{PANEL_SKELETON_IDS.map((id) => (
					<div key={id} className="rounded-xl border border-white/[0.07] bg-[#1b1b1b] p-5">
						<Skeleton className="h-4 w-36" />
						<Skeleton className="mt-3 h-3 w-52" />
						<Skeleton className="mt-8 h-56 w-full" />
					</div>
				))}
			</div>
		</div>
	);
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
	const rowIds = Array.from({ length: rows }, (_, position) => `skeleton-row-${position + 1}`);

	return (
		<div className="space-y-2" aria-label="Loading records" aria-busy="true">
			{rowIds.map((id) => (
				<div
					key={id}
					className="grid grid-cols-[minmax(8rem,1.4fr)_minmax(6rem,1fr)_minmax(5rem,0.7fr)] gap-4 border-b border-white/[0.06] py-4"
				>
					<Skeleton className="h-4 w-full max-w-48" />
					<Skeleton className="h-4 w-full max-w-28" />
					<Skeleton className="h-4 w-full max-w-20" />
				</div>
			))}
		</div>
	);
}

function CardGridSkeleton({ cards = 6 }: { cards?: number }) {
	const cardIds = Array.from({ length: cards }, (_, position) => `skeleton-card-${position + 1}`);

	return (
		<div
			className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
			aria-label="Loading cards"
			aria-busy="true"
		>
			{cardIds.map((id) => (
				<div key={id} className="min-h-56 rounded-xl border border-white/[0.07] bg-[#1b1b1b] p-5">
					<div className="flex justify-between">
						<Skeleton className="size-11" />
						<Skeleton className="h-5 w-20" />
					</div>
					<Skeleton className="mt-5 h-5 w-32" />
					<Skeleton className="mt-3 h-3 w-full" />
					<Skeleton className="mt-2 h-3 w-3/4" />
					<Skeleton className="mt-8 h-9 w-36" />
				</div>
			))}
		</div>
	);
}

export { CardGridSkeleton, DashboardSkeleton, TableSkeleton };
