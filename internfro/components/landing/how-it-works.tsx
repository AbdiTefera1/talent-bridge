import { UserPlus, Search, Send, GraduationCap } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Create your account",
    description:
      "Sign up as a talent or a company. It takes less than a minute to get started.",
  },
  {
    icon: Search,
    title: "Browse listings",
    description:
      "Explore internships, gigs, and training programs that match your skills and interests.",
  },
  {
    icon: Send,
    title: "Apply or enroll",
    description:
      "Submit applications to opportunities or enroll in training programs with one click.",
  },
  {
    icon: GraduationCap,
    title: "Grow your career",
    description:
      "Track your progress, gain new skills, and land the role you have been working towards.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
            Four simple steps to start building your career
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
                Step {index + 1}
              </div>
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="size-6 text-primary" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
