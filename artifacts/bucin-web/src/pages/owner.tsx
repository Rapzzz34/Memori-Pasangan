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
        <div
          className="min-h-[100dvh] flex flex-col items-center justify-center px-4"
          style={{ background: "linear-gradient(160deg, hsl(222,55%,9%), hsl(240,40%,8%))" }}
        >
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
            <h1 className="text-xl font-serif text-white">Owner Panel</h1>
            <p className="text-white/35 text-xs mt-0.5">
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
            className="text-white/40 hover:text-white text-xs gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="memories" className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-auto p-1 gap-1 bg-white/5 rounded-xl">
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
                className="flex flex-col gap-1 py-2 text-[10px] data-[state=active]:bg-white/10 data-[state=active]:text-primary rounded-lg"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* MEMORIES TAB */}
          <TabsContent value="memories" className="mt-6 space-y-4">
            <MemoriesSection />
          </TabsContent>

          {/* BUCKET LIST TAB */}
          <TabsContent value="bucket" className="mt-6 space-y-4">
            <BucketListSection />
          </TabsContent>

          {/* SONGS TAB */}
          <TabsContent value="songs" className="mt-6 space-y-4">
            <SongsSection
              personId={personId}
              name1={settings?.person1Name || "Orang Pertama"}
              name2={settings?.person2Name || "Orang Kedua"}
            />
          </TabsContent>

          {/* DIARY TAB */}
          <TabsContent value="diary" className="mt-6 space-y-4">
            <DiarySection />
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="mt-6">
            <SettingsForm />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function MemoriesSection() {
  const { memories, deleteMemory, isDeleting } = useMemories();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-white/50 text-xs">{memories.length} kenangan</p>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 text-xs h-8 text-white" style={{ background: "linear-gradient(135deg, hsl(330,85%,58%), hsl(320,90%,48%))" }}>
              <Plus className="w-3.5 h-3.5" /> Tambah Foto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Kenangan Baru</DialogTitle>
            </DialogHeader>
            <MemoryForm onSuccess={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {memories.length === 0 ? (
        <EmptyState icon={<ImageIcon className="w-6 h-6 text-white/20" />} label="Belum ada foto" />
      ) : (
        <div className="space-y-3">
          {memories.map(memory => (
            <div key={memory.id} className="flex items-center gap-3 rounded-xl p-3 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
              <img src={memory.imageUrl} alt={memory.title} className="w-14 h-14 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-medium truncate">{memory.title}</p>
                {memory.memoryDate && <p className="text-white/30 text-xs">{formatDate(memory.memoryDate)}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="w-7 h-7 text-white/30 hover:text-white" onClick={() => setEditingMemory(memory)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-7 h-7 text-white/30 hover:text-red-400">
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
                      <AlertDialogAction onClick={() => deleteMemory({ id: memory.id })} className="bg-destructive text-destructive-foreground">
                        Hapus
                      </AlertDialogAction>
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
          className="flex-1 text-sm h-9 border-white/15 text-white placeholder:text-white/25"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={isCreating || !newText.trim()}
          className="h-9 w-9 p-0 shrink-0 text-white"
          style={{ background: "linear-gradient(135deg, hsl(330,85%,58%), hsl(320,90%,48%))" }}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={<CheckSquare className="w-6 h-6 text-white/20" />} label="Belum ada impian" />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl px-3 py-3 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
              <button
                onClick={() => updateItem({ id: item.id, data: { completed: !item.completed } })}
                className="w-5 h-5 rounded border flex items-center justify-center shrink-0"
                style={{
                  background: item.completed ? "hsl(330,85%,58%)" : "transparent",
                  borderColor: item.completed ? "hsl(330,85%,58%)" : "rgba(255,255,255,0.2)",
                }}
              >
                {item.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className={`flex-1 text-sm ${item.completed ? "line-through text-white/30" : "text-white/75"}`}>
                {item.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-white/20 hover:text-red-400 shrink-0"
                onClick={() => deleteItem({ id: item.id })}
              >
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
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("artist", artist.trim());
    formData.append("person", person);
    if (audioFile) formData.append("audio", audioFile);
    createSong({ data: formData as unknown as { title: string } }, {
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
      <div className="rounded-xl border border-white/8 p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
        <p className="text-white/40 text-xs uppercase tracking-widest">Tambah Lagu</p>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Judul lagu" value={title} onChange={e => setTitle(e.target.value)}
            className="text-sm h-9 border-white/15 text-white placeholder:text-white/25" style={{ background: "rgba(255,255,255,0.05)" }} />
          <Input placeholder="Artis" value={artist} onChange={e => setArtist(e.target.value)}
            className="text-sm h-9 border-white/15 text-white placeholder:text-white/25" style={{ background: "rgba(255,255,255,0.05)" }} />
        </div>
        <div className="flex gap-2">
          {(["both", "person1", "person2"] as const).map(p => (
            <button
              key={p}
              onClick={() => setPerson(p)}
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
              style={{
                background: person === p ? "hsl(330,85%,58%)" : "rgba(255,255,255,0.04)",
                borderColor: person === p ? "hsl(330,85%,58%)" : "rgba(255,255,255,0.12)",
                color: person === p ? "white" : "rgba(255,255,255,0.4)",
              }}
            >
              {personLabels[p]}
            </button>
          ))}
        </div>
        <label
          className="flex items-center gap-2 text-xs rounded-lg px-3 py-2.5 border border-white/12 cursor-pointer text-white/35 w-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <Music2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate flex-1">
            {audioFile ? audioFile.name : "Upload audio (opsional)"}
          </span>
          {audioFile && (
            <button
              type="button"
              className="shrink-0 text-white/30 hover:text-white/60 text-xs"
              onClick={e => { e.preventDefault(); setAudioFile(null); if (fileRef.current) fileRef.current.value = ""; }}
            >✕</button>
          )}
          <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={e => setAudioFile(e.target.files?.[0] ?? null)} />
        </label>
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={isCreating || !title.trim()}
          className="w-full h-10 text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, hsl(330,85%,58%), hsl(320,90%,48%))" }}
        >
          {isCreating ? "Menyimpan..." : "+ Tambah Lagu"}
        </Button>
      </div>

      {songs.length === 0 ? (
        <EmptyState icon={<Music2 className="w-6 h-6 text-white/20" />} label="Belum ada lagu" />
      ) : (
        <div className="space-y-2">
          {songs.map(song => (
            <div key={song.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>
              <Music2 className="w-4 h-4 text-white/30 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm truncate">{song.title}</p>
                <p className="text-white/30 text-xs">{song.artist} · {personLabels[song.person] ?? song.person}</p>
              </div>
              <Button variant="ghost" size="icon" className="w-7 h-7 text-white/20 hover:text-red-400 shrink-0"
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
    const formData = new FormData();
    formData.append("content", content);
    if (imageFile) formData.append("image", imageFile);
    createEntry({ data: formData as unknown as { content?: string } }, {
      onSuccess: () => {
        setContent("");
        setImageFile(null);
        if (fileRef.current) fileRef.current.value = "";
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/8 p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
        <p className="text-white/40 text-xs uppercase tracking-widest">Tulis Entri Baru</p>
        <Textarea
          placeholder="Tulis perasaan atau cerita hari ini..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          className="text-sm border-white/15 text-white placeholder:text-white/25 resize-none"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div className="flex gap-2">
          <label
            className="flex-1 flex items-center gap-2 text-xs rounded-lg px-3 py-2 border border-white/12 cursor-pointer text-white/35"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            {imageFile ? imageFile.name : "Tambah foto (opsional)"}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
          </label>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isCreating || !content.trim()}
            className="h-9 shrink-0 text-xs text-white px-4"
            style={{ background: "linear-gradient(135deg, hsl(330,85%,58%), hsl(320,90%,48%))" }}
          >
            Simpan
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState icon={<BookOpen className="w-6 h-6 text-white/20" />} label="Belum ada entri diary" />
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="rounded-xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              {entry.imageUrl && (
                <img src={entry.imageUrl} alt="" className="w-full h-36 object-cover" />
              )}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white/60 text-xs leading-relaxed flex-1 line-clamp-3 whitespace-pre-line">{entry.content}</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-white/20 hover:text-red-400 shrink-0">
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
                        <AlertDialogAction onClick={() => deleteEntry({ id: entry.id })} className="bg-destructive text-destructive-foreground">Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <p className="text-white/20 text-[10px] mt-1">
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
    <div className="py-12 text-center flex flex-col items-center gap-3 border border-white/5 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
      {icon}
      <p className="text-white/25 text-xs">{label}</p>
    </div>
  );
}
