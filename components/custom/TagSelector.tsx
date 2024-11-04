'use client'

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

type Tag = {
    value: string
    label: string
}

interface TagSelectorProps {
    selectedTags: Tag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

export default function TagSelector({ selectedTags, setSelectedTags }: TagSelectorProps) {
    const tags = [
        { value: "frontend-dev", label: "Frontend Developer" },
        { value: "ui-designer", label: "UI Designer" },
        { value: "ux-designer", label: "UX Designer" },
        { value: "full-stack", label: "Full Stack Developer" },
        { value: "product-designer", label: "Product Designer" },
        { value: "web-developer", label: "Web Developer" },
        { value: "mobile-dev", label: "Mobile Developer" },
        { value: "devops", label: "DevOps Engineer" },
        { value: "product-manager", label: "Product Manager" },
        { value: "graphic-designer", label: "Graphic Designer" },
        { value: "software-engineer", label: "Software Engineer" },
        { value: "data-scientist", label: "Data Scientist" },
        { value: "tech-lead", label: "Tech Lead" },
        { value: "motion-designer", label: "Motion Designer" },
        { value: "cloud-architect", label: "Cloud Architect" }
    ]
 
    
    const [open, setOpen] = React.useState(true)
    // const [selectedTags, setSelectedTags] = React.useState<Tag[]>([])

    const handleSelectTag = React.useCallback((currentValue: string) => {
        setSelectedTags((prev: Tag[]) => {
            const selected = tags.find((tag) => tag.value === currentValue)
            if (selected && prev.length < 6 && !prev.some(tag => tag.value === selected.value)) {
                return [...prev, selected]
            }
            return prev
        })
        setOpen(false)
    }, [])


    const handleRemoveTag = React.useCallback((tagToRemove: Tag) => {
        console.log("Tag removed:", tagToRemove)
        setSelectedTags((prev) => prev.filter((tag) => tag.value !== tagToRemove.value))
    }, [])
    return (
        <div className="w-full max-w-md  p-4">
            <h2 className="text-2xl font-bold mb-4">Tag Selector</h2>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={selectedTags.length >= 6}
                        onClick={() => setOpen(true)}
                    >
                        {selectedTags.length === 0
                            ? "Select tags..."
                            : `${selectedTags.length} tag${selectedTags.length > 1 ? "s" : ""} selected`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max=w-xl p-0">
                    <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandEmpty>No tag found.</CommandEmpty>
                        <CommandGroup>
                            {tags?.map((tag) => (  // Remove the || [] here
                           
                                    <Button
                                        key={tag.value}
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => handleSelectTag(tag.value)}
                                        disabled={selectedTags.length >= 6 || selectedTags.some(t => t.value === tag.value)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedTags.some(t => t.value === tag.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {tag.label}
                                    </Button>
                            ))}
                        </CommandGroup>

                    </Command>
                </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-2 mt-4">
                {(selectedTags || []).map((tag) => (
                    <Badge key={tag.value} variant="secondary" className="text-sm">
                        {tag.label}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => handleRemoveTag(tag)}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {tag.label} tag</span>
                        </Button>
                    </Badge>
                ))}
            </div>
            {selectedTags.length >= 6 && (
                <p className="text-muted-foreground text-sm mt-2">Maximum of 6 tags reached.</p>
            )}
        </div>
    )
}
