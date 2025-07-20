import { cn } from "~/lib/utils";

export function ContactCard({ className }: { className?: string }) {
  return (
    <div
      id="card"
      className={cn(
        "flex w-2/3 flex-col overflow-hidden rounded-lg bg-white shadow-lg",
        className,
      )}
    >
      <div className="bg-gray-200 px-6 py-4 text-gray-700">
        The title of the card
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-align-center rounded-full border-gray-200 bg-orange-600 px-2 py-1 text-xs font-bold text-gray-200 uppercase">
          Under Review
        </div>
        <div className="text-sm font-bold text-gray-700">Aug 12, 2012</div>
      </div>
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="rounded-lg border bg-gray-200 p-4 text-sm">
          Here is a short comment about this employee
        </div>
      </div>

      <div className="bg-gray-200 px-6 py-4">
        <div className="text-xs font-bold text-gray-600 uppercase">
          Employee
        </div>
        <div className="flex items-center pt-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 font-bold text-gray-300 uppercase">
            RK
          </div>
          <div className="ml-4">
            <p className="font-bold">Rajat Kumar</p>
            <p className="mt-1 text-sm text-gray-700">Engineer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
