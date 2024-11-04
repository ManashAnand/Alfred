// TagSelector.tsx
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagSelectorProps {
  form: any; // adjust based on the type of form control if you have specific types
}

const frameworks = [
  { value: "frontend-developer", label: "Frontend Developer" },
  { value: "backend-developer", label: "Backend Developer" },
  { value: "fullstack-developer", label: "Full Stack Developer" },
  { value: "mobile-developer", label: "Mobile Developer" },
  { value: "ui-designer", label: "UI Designer" },
  { value: "ux-designer", label: "UX Designer" },
  { value: "product-designer", label: "Product Designer" },
  { value: "graphic-designer", label: "Graphic Designer" },
  { value: "devops-engineer", label: "DevOps Engineer" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "ml-engineer", label: "Machine Learning Engineer" },
  { value: "cloud-architect", label: "Cloud Architect" }
];

const TagSelector = ({ form }: TagSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name="Tag"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex mb-2">Tag</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[300px] justify-between"
                  type="button"
                >
                  {field.value
                    ? frameworks.find((framework) => framework.value === field.value)?.label
                    : "Select framework..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === framework.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {framework.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormDescription>
            This is your Tag a.k.a In which field you specialize. Careful, others will judge you on this.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TagSelector;
