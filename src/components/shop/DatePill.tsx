
import { format } from 'date-fns';

export default function DatePill({ date }: { date: string | Date }) {
    if (!date) return null;
    return (
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                {format(new Date(date), 'MMM dd, yyyy')}
            </span>
        </div>
    );
}
