import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Users, Plus, UserPlus, MapPin, Eye, EyeOff, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface Group {
  id: string;
  name: string;
  members: { name: string; email: string; lat: number; lng: number; sharing: boolean }[];
}

const MOCK_GROUPS: Group[] = [
  {
    id: "g1",
    name: "Bangalore Weekend Squad",
    members: [
      { name: "Priya", email: "priya@dsce.edu", lat: 12.975, lng: 77.591, sharing: true },
      { name: "Rahul", email: "rahul@dsce.edu", lat: 12.968, lng: 77.605, sharing: true },
      { name: "Ananya", email: "ananya@dsce.edu", lat: 12.952, lng: 77.578, sharing: false },
    ],
  },
];

export default function GroupsPage() {
  const { user } = useApp();
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <Users className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground font-medium">Sign in to use Group Trip Mode</p>
      </div>
    );
  }

  const createGroup = () => {
    if (!newName.trim()) return;
    setGroups(prev => [...prev, { id: `g${Date.now()}`, name: newName, members: [] }]);
    setNewName("");
    setShowCreate(false);
  };

  return (
    <div className="container py-6 min-h-[60vh]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Group Trips</h1>
          <p className="text-sm text-muted-foreground">Track friends and explore together</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Group
        </button>
      </div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-5 mb-6 card-elevated">
          <h3 className="font-semibold text-foreground mb-3 font-sans">Create New Group</h3>
          <div className="flex gap-2">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Group name..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={createGroup} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Create</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-lg bg-muted text-muted-foreground text-sm font-semibold">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {groups.map(group => (
          <motion.div key={group.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-5 card-elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground font-sans">{group.name}</h3>
              <span className="text-xs text-muted-foreground">{group.members.length} members</span>
            </div>
            <div className="space-y-3">
              {group.members.map((m, i) => (
                <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {m.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.sharing ? (
                      <span className="flex items-center gap-1 text-xs text-eco font-medium">
                        <MapPin className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <EyeOff className="w-3 h-3" /> Hidden
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {group.members.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No members yet. Invite friends to get started!</p>
              )}
            </div>
            <button className="flex items-center gap-1.5 mt-4 text-sm text-primary font-semibold hover:underline">
              <UserPlus className="w-4 h-4" /> Invite Friend
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
