"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProjectData } from "@/hooks/useProjectData";
import Navbar from "@/components/layout/navbar";

const menuItems = [
	{ label: "Dashboard", path: "dashboard", icon: "📊" },
	{ label: "API Keys", path: "apikeys", icon: "🔑" },
	{ label: "Playground", path: "playground", icon: "🧪" },
	{ label: "Documentation", path: "documentation", icon: "📚" },
	{ label: "Usage & Analytics", path: "usage", icon: "📈" },
	{ label: "Logs / Audit Trail", path: "logs", icon: "📝" },
	{ label: "Webhooks", path: "webhooks", icon: "🔔" },
	{ label: "Billing & Plans", path: "billing", icon: "💳" },
	{ label: "Project Settings", path: "project", icon: "⚙️" },
	{ label: "Eklentiler", path: "addons", icon: "🧩" },
	{ label: "Virtual Currency", path: "currency", icon: "💰" },
	{ label: "Web3 Wallet", path: "wallet", icon: "👛" },
	{ label: "NFT Activation", path: "nft", icon: "🖼️" },
	{ label: "Inventory", path: "inventory", icon: "🎒" },
	{ label: "Leaderboard", path: "leaderboard", icon: "🏆" },
	{ label: "Quests & Rewards", path: "quests", icon: "🎯" },
	{ label: "Notifications", path: "notifications", icon: "🔔" },
	{ label: "Support", path: "support", icon: "💬" },
	{ label: "OAuth", path: "oauth", icon: "🔒" },
];

export default function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(true);
	const pathname = usePathname();
	const idMatch = pathname.match(/\/dev\/project\/([^\/]+)/);
	const id = idMatch ? idMatch[1] : "";
	const sidebarWidth = open ? 256 : 64; // 64px = 16, 256px = 64 (tailwind units)
	const { project } = useProjectData();
	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-accent/30">
			{/* Navbar (original) */}
			<Navbar />
			{/* Fixed Sidebar (starts below navbar) */}
			<aside
				className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-30 border-r bg-background/90 shadow-lg transition-all duration-200 flex flex-col ${open ? "w-64" : "w-16"}`}
			>
				<div className="flex flex-col h-full">
					<div
						className={`flex items-center ${open ? "justify-between" : "justify-center"} h-14 px-2 border-b border-accent/30`}
					>
						<button
							className="p-2 text-xl font-bold hover:bg-accent/10 rounded transition flex items-center gap-2"
							onClick={() => setOpen((v) => !v)}
							aria-label="Menüyü Aç/Kapat"
						>
							<span className="text-primary">☰</span>
							{open && (
								<span className="text-base font-semibold ml-2">
									{project?.name || "Proje"}
								</span>
							)}
						</button>
					</div>
					<nav className="flex-1 overflow-y-auto py-4">
						<ul className="space-y-1">
							{menuItems.map((item) => {
								const active = pathname.includes(
									`/dev/project/${id}/${item.path}`
								);
								return (
									<li key={item.path}>
										<Link
											href={`/dev/project/${id}/${item.path}`}
											className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium
                        ${
												active
													? "bg-primary/10 text-primary font-bold shadow"
													: "hover:bg-accent/40 text-foreground/80"
											}
                        ${open ? "justify-start" : "justify-center"}
                      `}
											prefetch={false}
											tabIndex={open ? 0 : -1}
											style={!open ? { pointerEvents: "auto" } : {}}
											onClick={(e) => {
												if (!open) {
													// Menü kapalıysa, tıklama sırasında menüyü açma
													// Sadece yönlendirme yap
													// (Varsayılan davranış devam etsin, setOpen çağrılmasın)
												}
											}}
										>
											<span className="text-lg">{item.icon}</span>
											{open && <span>{item.label}</span>}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>
				</div>
			</aside>
			{/* Main Content Area (with project name header) */}
			<div
				className={`transition-all duration-200 min-h-screen pt-16`}
				style={{ marginLeft: sidebarWidth }}
			>
				<main className="flex-1 bg-background/80 p-6">{children}</main>
			</div>
		</div>
	);
}
