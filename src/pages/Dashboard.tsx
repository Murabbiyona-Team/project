import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, Moon, Sun, CheckSquare, Plus } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const [timeOfDayKey, setTimeOfDayKey] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDayKey('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDayKey('afternoon');
    else setTimeOfDayKey('evening');
    setIsDay(hour >= 6 && hour < 18);
  }, []);

  const calDays: string[] = t('dashboard.calDays', { returnObjects: true }) as string[];

  return (
    <div className="flex-1 min-h-0 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        
        {/* Left column (Col span 2) - Banner + Lessons */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-full min-h-0">
          
          {/* Top Banner - Exactly like reference */}
          <div className="relative overflow-hidden rounded-xl px-10 py-12 text-white min-h-[224px] flex items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-lg border border-zinc-700/30">
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  {isDay ? (
                    <Sun className="size-8 text-yellow-300 drop-shadow-md" />
                  ) : (
                    <Moon className="size-8 text-blue-200 drop-shadow-md" />
                  )}
                </div>
                <h2 className="text-[32px] font-bold tracking-tight leading-none">
                  {t('dashboard.greeting', { timeOfDay: t(`dashboard.${timeOfDayKey}`) })}
                </h2>
              </div>
              <p className="text-[17px] text-zinc-400 font-medium mt-1 pl-1">
                {t('dashboard.taskSubtitle', { taskCount: 1 })}
              </p>
            </div>
            {/* Minimalist decorative accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-zinc-400/5 rounded-full blur-[60px] -ml-20 -mb-20"></div>
          </div>

          {/* Lessons This Week - Match Feedback's card style */}
          <div className="flex-1 min-h-0">
            <div className="bg-card text-card-foreground rounded-xl card-elevation border border-border h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pt-6 px-6 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-muted">
                    <BookOpen className="size-5 text-foreground" />
                  </div>
                  <div className="flex items-baseline gap-1.5 font-bold tracking-tight">
                    <h2 className="text-[18px]">{t('dashboard.lessonsThisWeek').split('This')[0] || 'Lessons'}</h2>
                    <span className="text-[17px] text-muted-foreground font-medium lowercase">this week</span>
                  </div>
                </div>
                <button className="text-[11px] hover:text-foreground text-muted-foreground font-bold transition-all cursor-pointer tracking-wider uppercase">
                  {t('dashboard.viewAll', 'View All')}
                </button>
              </div>
              <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="size-16 rounded-xl bg-muted/60 flex items-center justify-center mb-4">
                  <BookOpen className="size-8 text-muted-foreground/30" />
                </div>
                <p className="text-[15px] font-semibold text-muted-foreground/80">{t('dashboard.noLessons', 'No lessons scheduled this week')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle column - Schedule Today */}
        <div className="h-full min-h-0">
          <div className="bg-card text-card-foreground rounded-xl card-elevation border border-border flex flex-col overflow-hidden h-full">
            <div className="flex items-center px-6 shrink-0 h-[68px] border-b border-border/40">
              <div className="flex items-baseline gap-1.5 font-bold tracking-tight">
                <h2 className="text-[18px]">{t('dashboard.scheduleToday').split(' ')[0] || 'Schedule'}</h2>
                <span className="text-[17px] text-muted-foreground font-medium lowercase">today</span>
              </div>
            </div>
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-12 text-center p-6">
              <div className="size-16 rounded-xl bg-muted/60 flex items-center justify-center mb-4">
                <CalendarDays className="size-8 text-muted-foreground/30" />
              </div>
              <p className="text-[15px] font-semibold text-muted-foreground/80">{t('dashboard.noClasses', 'No classes scheduled today')}</p>
            </div>
          </div>
        </div>

        {/* Right column - Calendar \u0026 Tasks */}
        <div className="h-full min-h-0 flex flex-col gap-4">
          <div className="bg-card text-card-foreground rounded-xl card-elevation border border-border p-6 flex flex-col flex-1 min-h-0">
            <div className="shrink-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-muted">
                    <CalendarDays className="size-5 text-foreground" />
                  </div>
                  <div className="flex items-baseline gap-1.5 font-bold tracking-tight">
                    <span className="text-[18px]">{t('dashboard.calMonth', 'March').split(' ')[0] || 'March'}</span>
                    <span className="text-[17px] text-muted-foreground font-medium">2026</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer active:scale-95">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer active:scale-95">
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 mb-2">
                {calDays.map((day) => (
                   <div key={day} className="text-center text-[10px] font-bold text-muted-foreground/60 py-1 uppercase tracking-wider">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-y-0.5">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                  <div key={date} className="relative flex justify-center py-0.5">
                    <button 
                      className={`relative z-10 h-8 w-8 inline-flex items-center justify-center text-sm transition-colors rounded-lg
                        ${date === 31 ? 'bg-zinc-900 text-white font-bold' : 'text-foreground font-medium hover:bg-muted'}
                      `}
                    >
                      <span className="leading-none">{date}</span>
                      {date === 29 && <div className="size-1 rounded-full mt-0.5 bg-rose-500 absolute bottom-1"></div>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="my-6 border-t border-border/60"></div>
            
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-muted">
                    <CheckSquare className="size-5 text-foreground" />
                  </div>
                  <h3 className="text-[18px] font-bold tracking-tight">{t('dashboard.tasksWidget', 'Tasks')}</h3>
                </div>
                <button className="inline-flex items-center justify-center hover:bg-muted rounded-md size-8 transition-colors border border-border active:scale-95">
                  <Plus className="size-4 text-muted-foreground" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="px-4 py-3 rounded-lg transition-all bg-muted/40 hover:bg-muted/80 border border-border/30 cursor-pointer flex items-center gap-3 group active:scale-[0.98]">
                  <div className="size-4 rounded border border-border bg-white group-hover:border-zinc-900 transition-colors"></div>
                  <h4 className="font-semibold flex-1 text-sm truncate text-foreground/90">{t('dashboard.taskItem', "O'quvchilarning 3 choraklik...")}</h4>
                  <span className="text-[10px] shrink-0 text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full uppercase">Mar 29</span>
                </div>
              </div>
              
              <button className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors mt-6 font-bold tracking-wider uppercase">
                {t('dashboard.viewAll', 'View All')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
