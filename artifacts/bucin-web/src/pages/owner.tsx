import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMemories } from "@/hooks/use-memories";
import { Layout } from "@/components/layout";
import { LoginForm } from "@/components/login-form";
import { SettingsForm } from "@/components/settings-form";
import { MemoryForm } from "@/components/memory-form";
import { formatDate } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Settings, Image as ImageIcon, Pencil, Trash2, LogOut } from "lucide-react";
import type { Memory } from "@workspace/api-client-react";

export default function OwnerPanel() {
  const { isOwner, logout, isLoading: authLoading } = useAuth();
  const { memories, deleteMemory, isDeleting } = useMemories();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 rounded-full bg-primary/20 mb-4"></div>
            <div className="h-4 w-24 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isOwner) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <LoginForm />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Owner Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your shared journal.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => logout()} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="memories" className="w-full">
          <TabsList className="mb-8 p-1 bg-muted/50">
            <TabsTrigger value="memories" className="gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <ImageIcon className="w-4 h-4" />
              Memories
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="memories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Your Memories</h2>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Memory
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-primary">New Memory</DialogTitle>
                  </DialogHeader>
                  <MemoryForm onSuccess={() => setIsAddModalOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            {memories.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-border rounded-xl bg-card/50">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 text-primary">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium mb-1">No memories yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Add your first memory to start the journal.</p>
                <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Memory
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {memories.map((memory) => (
                  <Card key={memory.id} className="overflow-hidden flex flex-col sm:flex-row group">
                    <div className="w-full sm:w-32 md:w-40 aspect-video sm:aspect-square relative shrink-0">
                      <img 
                        src={memory.imageUrl} 
                        alt={memory.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4 sm:p-6 flex flex-col">
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-medium text-lg leading-tight mb-1">{memory.title}</h3>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setEditingMemory(memory)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete memory?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the photo and its caption.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteMemory({ id: memory.id })}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        {memory.memoryDate && (
                          <div className="text-xs text-muted-foreground mb-2">{formatDate(memory.memoryDate)}</div>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{memory.caption}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <SettingsForm />
          </TabsContent>
        </Tabs>

        {/* Edit Modal */}
        <Dialog open={!!editingMemory} onOpenChange={(open) => !open && setEditingMemory(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-primary">Edit Memory</DialogTitle>
            </DialogHeader>
            {editingMemory && (
              <MemoryForm memory={editingMemory} onSuccess={() => setEditingMemory(null)} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
