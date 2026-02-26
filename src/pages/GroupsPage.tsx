import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Users, Plus, UserPlus, MapPin, EyeOff } from "lucide-react";
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

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="font-display font-bold text-foreground text-lg">Sign in to use Group Trip Mode</p>
        <p className="text-sm text-muted-foreground mt-1">Plan adventures with your friends</p>
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
    <div className="container py-8 min-h-[60vh]">
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Group Trips</h1>
          <p className="text-sm text-muted-foreground mt-1">Track friends and explore together</p>
        </motion.div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <Plus className="w-4 h-4" /> New Group
        </button>
      </div>

      {showCreate && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-lg">
          <h3 className="font-display font-bold text-foreground text-lg mb-4">Create New Group</h3>
          <div className="flex gap-2">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Group name..."
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
            <button onClick={createGroup} className="px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold">Create</button>
            <button onClick={() => setShowCreate(false)} className="px-5 py-3 rounded-xl bg-muted text-muted-foreground text-sm font-bold">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-5">
        {groups.map((group, gi) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 card-elevated"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-foreground text-lg">{group.name}</h3>
              <span className="text-xs text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">{group.members.length} members</span>
            </div>
            <div className="space-y-3">
              {group.members.map((m, i) => (
                <div key={i} className="flex items-center justify-between bg-muted/50 rounded-xl p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                      {m.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  {m.sharing ? (
                    <span className="flex items-center gap-1.5 text-xs text-eco font-bold bg-eco-light px-2.5 py-1 rounded-full">
                      <MapPin className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <EyeOff className="w-3 h-3" /> Hidden
                    </span>
                  )}
                </div>
              ))}
              {group.members.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">No members yet. Invite friends to get started!</p>
              )}
            </div>
            <button className="flex items-center gap-1.5 mt-5 text-sm text-primary font-bold hover:underline">
              <UserPlus className="w-4 h-4" /> Invite Friend
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
