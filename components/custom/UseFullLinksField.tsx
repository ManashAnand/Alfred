// UsefulLinksField.tsx
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { TwitterIcon, User2Icon, GithubIcon, Code2Icon, CodeIcon, ComputerIcon, TextIcon, UserCircle } from "lucide-react";


const useFullLinks = [
    {
        name: "leetcode" as const,
        icon: <CodeIcon />,
        placeholder: "Enter you leetcode profile",
        formDescp: "This is your public display leetcode."
    },
    {
        name: "github" as const,
        icon: <GithubIcon />,
        placeholder: "Enter you Github profile",
        formDescp: "This is your public display Github."
    },
    {
        name: "codeforces" as const,
        icon: <Code2Icon />,
        placeholder: "Enter you Codeforces profile",
        formDescp: "This is your public display Codeforces."
    },
    {
        name: "atcoder" as const,
        icon: <CodeIcon />,
        placeholder: "Enter you atcoder profile",
        formDescp: "This is your public display atcoder."
    },
    {
        name: "codechef" as const,
        icon: <Code2Icon />,
        placeholder: "Enter you codechef profile",
        formDescp: "This is your public display codechef."
    },
    {
        name: "kaggle" as const,
        icon: <ComputerIcon />,
        placeholder: "Enter you kaggle profile",
        formDescp: "This is your public display kaggle."
    },
    {
        name: "medium" as const,
        icon: <TextIcon />,
        placeholder: "Enter you medium profile",
        formDescp: "This is your public display medium."
    },
    {
        name: "blogs" as const,
        icon: <TextIcon />,
        placeholder: "Enter you blogs profile",
        formDescp: "This is your public display blogs."
    },
    {
        name: "portfolio" as const,
        icon: <User2Icon />,
        placeholder: "Enter you blogs portfolio",
        formDescp: "This is your public display portfolio."
    },
    {
        name: "twitter" as const,
        icon: <TwitterIcon />,
        placeholder: "Enter you blogs twitter",
        formDescp: "This is your public display twitter."
    },

]

const UsefulLinksField = ({ form }: { form: any }) => {
  return (
    <div className="grid sm:grid-cols-2 gap-2 container grid-cols-1 px-2 sm:px-0">
      {useFullLinks.map((item) => (
        <FormField
          key={item.name}
          control={form.control}
          name={item.name}
          render={({ field }) => (
            <FormItem className="w-full ">
              <FormLabel>{item.name}</FormLabel>
              <div className="flex items-center justify-center gap-1">
                {item.icon}
                <FormControl>
                  <Input placeholder={item.placeholder} {...field} />
                </FormControl>
              </div>
              <FormDescription>{item.formDescp}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}

export default UsefulLinksField;
