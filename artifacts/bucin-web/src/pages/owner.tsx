import { useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMemories } from "@/hooks/use-memories";
import { useBucketList } from "@/hooks/use-bucket-list";
import { useSongs } from "@/hooks/use-songs";
import { useDiary } from "@/hooks/use-diary";
import { useSettings } from "@/hooks/use-settings";
import { Layout } from "@/components/layout";
import { LoginForm } from "@/components/login-form";
import { SettingsForm } from "@/components/settings-form";
import { MemoryForm } from "@/components/memory-form";
import { formatDate } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Settings, Image as ImageIcon, Trash2, LogOut, Music2, BookOpen, CheckSquare, Check, Pencil } from "lucide-react";
import type { Memory } from "@workspace/api-client-react";

const G = "linear-gradient(135deg, hsl(330,100%,55%), hsl(310,100%,50%))";
const cardStyle = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,30,140,0.18)",
  boxShadow: "0 2px 16px rgba(255,20,147,0.10)",
};
const inputStyle = {
  background: "rgba(255,255,255,0.06)",
  borderColor: "rgba(255,30,140,0.22)",
  color: "rgba(255,255,255,0.88)",
};

export default function OwnerPanel() {
  const { isOwner, personId, logout, isLoading: authLoading } = useAuth();
  const { settings } = useSettings();

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isOwner) {
    return (
      <Layout>
        <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4">
          <LoginForm />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[100dvh] py-8 px-4 max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-serif" style={{ color: "rgba(255,255,255,0.88)" }}>Owner Panel</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,150,200,0.42)" }}>
              {personId === 1
                ? `Login sebagai ${settings?.person1Name || "Orang Pertama"}`
                : personId === 2
                ? `Login sebagai ${settings?.person2Name || "Orang Kedua"}`
                : "Kelola kenangan kalian"
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="text-xs gap-1.5"
            style={{ color: "rgba(255,150,200,0.38)" }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="memories" className="w-full">
          <TabsList
            className="w-full grid grid-cols-5 h-auto p-1 gap-1 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,180,220,0.30)",
            }}
          >
            {[
              { value: "memories", icon: <ImageIcon className="w-3.5 h-3.5" />, label: "Foto" },
              { value: "bucket", icon: <CheckSquare className="w-3.5 h-3.5" />, label: "Impian" },
              { value: "songs", icon: <Music2 className="w-3.5 h-3.5" />, label: "Lagu" },
              { value: "diary", icon: <BookOpen className="w-3.5 h-3.5" />, label: "Diary" },
              { value: "settings", icon: <Settings className="w-3.5 h-3.5" />, label: "Setelan" },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col gap-1 py-2 text-[10px] rounded-lg data-[state=active]:shadow-sm"
                style={{ color: "rgba(255,150,200,0.45)" }}
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="memories" className="mt-6 space-y-4">
            <MemoriesSection />
          </TabsContent>
          <TabsContent value="bucket" className="mt-6 space-y-4">
            <BucketListSection />
          </TabsContent>
          <TabsContent value="songs" className="mt-6 space-y-4">
            <SongsSection
              personId={personId}
              name1={settings?.person1Name || "Orang Pertama"}
              name2={settings?.person2Name || "Orang Kedua"}
            />
          </TabsContent>
          <TabsContent value="diary" className="mt-6 space-y-4">
            <DiarySection />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <SettingsForm />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function MemoriesSection() {
  const { memories, deleteMemory } = useMemories();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs" style={{ color: "rgba(255,150,200,0.38)" }}>{memories.length} kenangan</p>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 text-xs h-8 text-white" style={{ background: G }}>
              <Plus className="w-3.5 h-3.5" /> Tambah Foto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Kenangan Baru</DialogTitle></DialogHeader>
            <MemoryForm onSuccess={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {memories.length === 0 ? (
        <EmptyState icon={<ImageIcon className="w-6 h-6" style={{ color: "rgba(255,20,147,0.30)" }} />} label="Belum ada foto" />
      ) : (
        <div className="space-y-3">
          {memories.map(memory => (
            <div key={memory.id} className="flex items-center gap-3 rounded-2xl p-3" style={cardStyle}>
              <img src={memory.imageUrl} alt={memory.title} className="w-14 h-14 object-cover rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.88)" }}>{memory.title}</p>
                {memory.memoryDate && <p className="text-xs" style={{ color: "rgba(255,150,200,0.34)" }}>{formatDate(memory.memoryDate)}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="w-7 h-7" style={{ color: "rgba(255,255,255,0.28)" }}
                  onClick={() => setEditingMemory(memory)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-7 h-7" style={{ color: "rgba(255,150,200,0.28)" }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus kenangan?</AlertDialogTitle>
                      <AlertDialogDescription>Foto dan caption akan dihapus permanen.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMemory({ id: memory.id })} className="bg-destructive text-destructive-foreground">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editingMemory} onOpenChange={open => !open && setEditingMemory(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Kenangan</DialogTitle></DialogHeader>
          {editingMemory && <MemoryForm memory={editingMemory} onSuccess={() => setEditingMemory(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BucketListSection() {
  const { items, createItem, isCreating, updateItem, deleteItem } = useBucketList();
  const [newText, setNewText] = useState("");

  const handleAdd = () => {
    if (!newText.trim()) return;
    createItem({ data: { text: newText.trim() } }, { onSuccess: () => setNewText("") });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Tambah impian baru..."
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          className="flex-1 text-sm h-9 placeholder:text-pink-300"
          style={inputStyle}
        />
        <Button size="sm" onClick={handleAdd} disabled={isCreating || !newText.trim()}
          className="h-9 w-9 p-0 shrink-0 text-white" style={{ background: G }}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={<CheckSquare className="w-6 h-6" style={{ color: "rgba(255,20,147,0.30)" }} />} label="Belum ada impian" />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl px-3 py-3" style={cardStyle}>
              <button
                onClick={() => updateItem({ id: item.id, data: { completed: !item.completed } })}
                className="w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all"
                style={{
                  background: item.completed ? "hsl(330,100%,55%)" : "transparent",
                  borderColor: item.completed ? "hsl(330,100%,55%)" : "rgba(255,20,147,0.30)",
                  boxShadow: item.completed ? "0 0 8px rgba(255,20,147,0.4)" : "none",
                }}
              >
                {item.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className={`flex-1 text-sm ${item.completed ? "line-through" : ""}`}
                style={{ color: item.completed ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.88)" }}>
                {item.text}
              </span>
              <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0 hover:text-red-400"
                style={{ color: "rgba(255,255,255,0.20)" }}
                onClick={() => deleteItem({ id: item.id })}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SongsSection({ personId, name1, name2 }: { personId: number | null; name1: string; name2: string }) {
  const { songs, createSong, isCreating, deleteSong } = useSongs();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [person, setPerson] = useState<string>(
    personId === 1 ? "person1" : personId === 2 ? "person2" : "both"
  );
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!title.trim()) return;
    createSong({
      data: {
        title: title.trim(),
        artist: artist.trim() || undefined,
        person,
        audio: audioFile ?? undefined,
      }
    }, {
      onSuccess: () => {
        setTitle("");
        setArtist("");
        setAudioFile(null);
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  };

  const personLabels: Record<string, string> = {
    both: "Berdua",
    person1: `Playlist ${name1}`,
    person2: `Playlist ${name2}`,
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 space-y-3" style={cardStyle}>
        <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "rgba(255,150,200,0.38)" }}>
          Tambah Lagu
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Judul lagu" value={title} onChange={e => setTitle(e.target.value)}
            className="text-sm h-9 placeholder:text-pink-300" style={inputStyle} />
          <Input placeholder="Artis" value={artist} onChange={e => setArtist(e.target.value)}
            className="text-sm h-9 placeholder:text-pink-300" style={inputStyle} />
        </div>
        <div className="flex gap-2">
          {(["both", "person1", "person2"] as const).map(p => (
            <button
              key={p}
              onClick={() => setPerson(p)}
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
              style={{
                background: person === p ? "hsl(330,100%,55%)" : "rgba(255,255,255,0.80)",
                borderColor: person === p ? "hsl(330,100%,55%)" : "rgba(255,150,200,0.35)",
                color: person === p ? "white" : "rgba(255,200,220,0.55)",
                boxShadow: person === p ? "0 0 12px rgba(255,20,147,0.35)" : "none",
              }}
            >
              {personLabels[p]}
            </button>
          ))}
        </div>
        <label
          className="flex items-center gap-2 text-xs rounded-xl px-3 py-2.5 border cursor-pointer w-full overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.80)",
            borderColor: "rgba(255,150,200,0.35)",
            color: "rgba(255,150,200,0.42)",
          }}
        >
          <Music2 className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(330,100%,55%)" }} />
          <span className="truncate flex-1">
            {audioFile ? audioFile.name : "Upload audio / video (opsional)"}
          </span>
          {audioFile && (
            <button type="button" className="shrink-0 text-xs" style={{ color: "rgba(255,255,255,0.28)" }}
              onClick={e => { e.preventDefault(); setAudioFile(null); if (fileRef.current) fileRef.current.value = ""; }}>
              ✕
            </button>
          )}
          <input ref={fileRef} type="file" accept="audio/*,video/*" className="hidden"
            onChange={e => setAudioFile(e.target.files?.[0] ?? null)} />
        </label>
        <Button size="sm" onClick={handleAdd} disabled={isCreating || !title.trim()}
          className="w-full h-10 text-sm font-medium text-white"
          style={{ background: G, boxShadow: "0 4px 14px rgba(255,20,147,0.30)" }}>
          {isCreating ? "Menyimpan..." : "+ Tambah Lagu"}
        </Button>
      </div>

      {songs.length === 0 ? (
        <EmptyState icon={<Music2 className="w-6 h-6" style={{ color: "rgba(255,20,147,0.30)" }} />} label="Belum ada lagu" />
      ) : (
        <div className="space-y-2">
          {songs.map(song => (
            <div key={song.id} className="flex items-center gap-3 rounded-2xl px-3 py-2.5" style={cardStyle}>
              <div className="shrink-0">
                <Music2 className="w-4 h-4" style={{ color: song.audioUrl ? "hsl(330,100%,55%)" : "rgba(255,255,255,0.15)", filter: song.audioUrl ? "drop-shadow(0 0 4px rgba(255,20,147,0.5))" : "none" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm truncate" style={{ color: "rgba(255,255,255,0.88)" }}>
                    {song.title || "Tanpa judul"}
                  </p>
                  {!song.audioUrl && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded border shrink-0"
                      style={{ color: "rgba(255,150,200,0.28)", borderColor: "rgba(255,150,200,0.25)" }}>
                      no audio
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: "rgba(255,150,200,0.34)" }}>
                  {song.artist ? `${song.artist} · ` : ""}{personLabels[song.person] ?? song.person}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0 hover:text-red-400"
                style={{ color: "rgba(255,255,255,0.20)" }}
                onClick={() => deleteSong({ id: song.id })}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DiarySection() {
  const { entries, createEntry, isCreating, deleteEntry } = useDiary();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!content.trim()) return;
    createEntry({
      data: {
        content: content.trim(),
        image: imageFile ?? undefined,
      }
    }, {
      onSuccess: () => {
        setContent("");
        setImageFile(null);
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 space-y-3" style={cardStyle}>
        <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "rgba(255,150,200,0.38)" }}>
          Tulis Entri Baru
        </p>
        <Textarea
          placeholder="Tulis perasaan atau cerita hari ini..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          className="text-sm resize-none placeholder:text-pink-300"
          style={inputStyle}
        />
        <div className="flex gap-2">
          <label
            className="flex-1 flex items-center gap-2 text-xs rounded-xl px-3 py-2 border cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.80)",
              borderColor: "rgba(255,150,200,0.35)",
              color: "rgba(255,150,200,0.42)",
            }}
          >
            <ImageIcon className="w-3.5 h-3.5" style={{ color: "hsl(330,100%,55%)" }} />
            {imageFile ? imageFile.name : "Tambah foto (opsional)"}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
          </label>
          <Button size="sm" onClick={handleSave} disabled={isCreating || !content.trim()}
            className="h-9 shrink-0 text-xs text-white px-4"
            style={{ background: G, boxShadow: "0 4px 12px rgba(255,20,147,0.28)" }}>
            Simpan
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState icon={<BookOpen className="w-6 h-6" style={{ color: "rgba(255,20,147,0.30)" }} />} label="Belum ada entri diary" />
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="rounded-2xl overflow-hidden" style={cardStyle}>
              {entry.imageUrl && (
                <img src={entry.imageUrl} alt="" className="w-full h-36 object-cover" />
              )}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs leading-relaxed flex-1 line-clamp-3 whitespace-pre-line"
                    style={{ color: "rgba(255,200,220,0.65)" }}>
                    {entry.content}
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-7 h-7 shrink-0 hover:text-red-400"
                        style={{ color: "rgba(255,255,255,0.20)" }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus entri ini?</AlertDialogTitle>
                        <AlertDialogDescription>Entri diary akan dihapus permanen.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteEntry({ id: entry.id })}
                          className="bg-destructive text-destructive-foreground">Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <p className="text-[10px] mt-1" style={{ color: "rgba(255,150,200,0.28)" }}>
                  {new Date(entry.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="py-12 text-center flex flex-col items-center gap-3 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px dashed rgba(255,30,140,0.18)",
      }}
    >
      {icon}
      <p className="text-xs" style={{ color: "rgba(255,150,200,0.28)" }}>{label}</p>
    </div>
  );
}
