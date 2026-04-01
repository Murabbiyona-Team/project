import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera, CameraOff, CheckCircle, AlertCircle, RotateCcw,
  Volume2, VolumeX, Users, Clock
} from 'lucide-react';

interface ScanResult {
  studentName: string;
  studentId: string;
  time: string;
  status: 'success' | 'duplicate' | 'unknown';
}

// Mock student QR database
const studentQRMap: Record<string, string> = {
  'STU-001': 'Karimov Jasur',
  'STU-002': 'Abdullayeva Madina',
  'STU-003': 'Toshmatov Sardor',
  'STU-004': 'Rahimova Zilola',
  'STU-005': 'Nazarov Bobur',
  'STU-006': 'Islomova Shahlo',
  'STU-007': 'Umarov Azizbek',
  'STU-008': 'Xolmatova Dilfuza',
  'STU-009': 'Ergashev Sherzod',
  'STU-010': 'Qodirova Kamola',
  'STU-011': 'Aliyev Firdavs',
  'STU-012': 'Mirzayeva Gulnora',
  'STU-013': 'Raximov Otabek',
  'STU-014': 'Tursunova Mohira',
  'STU-015': 'Sobirov Ulugbek',
};

const totalStudents = Object.keys(studentQRMap).length;
const classes = ['5-A', '5-B', '6-A', '6-B', '7-A'];
const subjects = ['Matematika', 'Algebra', 'Geometriya', 'Fizika'];

export default function MobileScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedClass, setSelectedClass] = useState('5-A');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedIdsRef = useRef<Set<string>>(new Set());

  const startTime = useRef(new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }));

  const playBeep = useCallback((type: 'success' | 'error') => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = type === 'success' ? 800 : 300;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + (type === 'success' ? 0.15 : 0.3));
    } catch {}
  }, [soundEnabled]);

  const handleScan = useCallback((decodedText: string) => {
    const now = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const studentId = decodedText.trim();

    if (scannedIdsRef.current.has(studentId)) {
      const name = studentQRMap[studentId] || studentId;
      const result: ScanResult = { studentName: name, studentId, time: now, status: 'duplicate' };
      setLastScan(result);
      playBeep('error');
      // Vibrate
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      return;
    }

    const studentName = studentQRMap[studentId];
    if (studentName) {
      scannedIdsRef.current.add(studentId);
      const result: ScanResult = { studentName, studentId, time: now, status: 'success' };
      setScans(prev => [result, ...prev]);
      setLastScan(result);
      playBeep('success');
      if (navigator.vibrate) navigator.vibrate(100);
    } else {
      const result: ScanResult = { studentName: studentId, studentId, time: now, status: 'unknown' };
      setLastScan(result);
      playBeep('error');
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, [playBeep]);

  const startScanner = useCallback(async () => {
    setCameraError(null);
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        handleScan,
        () => {}
      );
      setIsScanning(true);
    } catch (err: any) {
      setCameraError(err?.message || 'Kamerani ochishda xatolik. Ruxsat bering.');
    }
  }, [handleScan]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const resetSession = () => {
    scannedIdsRef.current.clear();
    setScans([]);
    setLastScan(null);
  };

  const attendancePercent = Math.round((scans.length / totalStudents) * 100);

  return (
    <div className="space-y-4 pb-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">QR Davomat</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            <Clock className="w-3 h-3 inline mr-1" />
            Boshlangan: {startTime.current}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-zinc-600" /> : <VolumeX className="w-5 h-5 text-zinc-400" />}
          </button>
          <button
            onClick={resetSession}
            className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Live counter bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-700">
            <Users className="w-4 h-4 inline mr-1" />
            {scans.length} / {totalStudents} o'quvchi
          </span>
          <span className={`text-sm font-bold ${attendancePercent >= 80 ? 'text-emerald-600' : attendancePercent >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
            {attendancePercent}%
          </span>
        </div>
        <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              attendancePercent >= 80 ? 'bg-emerald-500' : attendancePercent >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${attendancePercent}%` }}
          />
        </div>
      </div>

      {/* Class & Subject pills */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {classes.map(c => (
            <button
              key={c}
              onClick={() => setSelectedClass(c)}
              className={`flex-shrink-0 h-9 px-4 rounded-full text-sm font-medium transition-all ${
                selectedClass === c ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white text-zinc-600 border border-zinc-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`flex-shrink-0 h-9 px-4 rounded-full text-sm font-medium transition-all ${
                selectedSubject === s ? 'bg-blue-500 text-white shadow-sm' : 'bg-white text-zinc-600 border border-zinc-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* QR Scanner Area */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden">
        <div id="qr-reader" className={isScanning ? '' : 'hidden'} />

        {!isScanning && (
          <div className="flex flex-col items-center justify-center p-8 gap-4" style={{ minHeight: 280 }}>
            {/* Corner brackets mockup */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />
              <Camera className="w-12 h-12 text-zinc-500" />
            </div>
            <p className="text-zinc-400 text-sm text-center">
              Kamerani yoqib QR kodni skanerlang
            </p>
          </div>
        )}

        {cameraError && (
          <div className="p-4 bg-red-500/10 flex items-center gap-2 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {cameraError}
          </div>
        )}

        {/* Last scan result toast */}
        {lastScan && (
          <div className={`mx-3 mb-3 p-3 rounded-xl flex items-center gap-3 animate-pulse ${
            lastScan.status === 'success' ? 'bg-emerald-500/20' :
            lastScan.status === 'duplicate' ? 'bg-yellow-500/20' : 'bg-red-500/20'
          }`}>
            {lastScan.status === 'success' ? (
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className={`w-6 h-6 flex-shrink-0 ${lastScan.status === 'duplicate' ? 'text-yellow-400' : 'text-red-400'}`} />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${
                lastScan.status === 'success' ? 'text-emerald-300' :
                lastScan.status === 'duplicate' ? 'text-yellow-300' : 'text-red-300'
              }`}>
                {lastScan.studentName}
              </p>
              <p className="text-xs text-zinc-400">
                {lastScan.status === 'success' ? 'Qayd etildi' :
                 lastScan.status === 'duplicate' ? 'Allaqachon qayd etilgan' : 'Noma\'lum QR kod'}
                {' · '}{lastScan.time}
              </p>
            </div>
          </div>
        )}

        {/* Camera toggle button */}
        <div className="p-3 pt-0">
          <button
            onClick={isScanning ? stopScanner : startScanner}
            className={`w-full h-12 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isScanning
                ? 'bg-red-500 text-white active:bg-red-600'
                : 'bg-emerald-500 text-white active:bg-emerald-600'
            }`}
          >
            {isScanning ? (
              <><CameraOff className="w-5 h-5" /> Kamerani to'xtatish</>
            ) : (
              <><Camera className="w-5 h-5" /> Kamerani yoqish</>
            )}
          </button>
        </div>
      </div>

      {/* Scan History */}
      {scans.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-semibold text-zinc-900 mb-3">
            Qayd etilganlar ({scans.length})
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {scans.map((scan, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700 flex-shrink-0">
                    {scans.length - i}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{scan.studentName}</p>
                    <p className="text-xs text-zinc-400">{scan.time}</p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finish Button */}
      {scans.length > 0 && (
        <button
          onClick={() => {
            alert(`Davomat saqlandi!\n${selectedClass} — ${selectedSubject}\n${scans.length}/${totalStudents} o'quvchi qayd etildi`);
            resetSession();
          }}
          className="w-full h-12 bg-zinc-900 text-white font-semibold rounded-xl active:bg-zinc-800 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Davomatni yakunlash
        </button>
      )}
    </div>
  );
}
