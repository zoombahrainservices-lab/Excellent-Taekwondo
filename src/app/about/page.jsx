import Image from "next/image";
import instructors from "@/data/instructors.json";

export default function AboutPage() {
  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold">About Excellent Taekwondo</h1>
      <p className="mt-4 text-slate-700 max-w-3xl">Our mission is to empower students of all ages through the practice of Taekwondo—building discipline, confidence, and fitness in a safe and supportive environment.</p>

      <section className="mt-12 grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-2xl font-semibold">What is Taekwondo?</h2>
          <p className="mt-2 text-slate-700">Taekwondo is a Korean martial art emphasizing kicking techniques, forms (poomsae), and sparring. Training develops balance, flexibility, and self-control.</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Belt System Overview</h2>
          <p className="mt-2 text-slate-700">Students progress through colored belts by mastering techniques and demonstrating character. Advancement culminates in earning a Black Belt and beyond (Dan ranks).</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl font-bold">Our Instructors</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((ins) => (
            <article key={ins.name} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <div className="relative h-56">
                <Image
                  src={ins.photo}
                  alt={`${ins.name} - ${ins.role}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-dark">{ins.name}</h3>
                <p className="text-sm text-primary font-medium">{ins.role}</p>
                <p className="mt-2 text-slate-700">{ins.bio}</p>
                <p className="mt-2 text-sm text-slate-600">Belts: {ins.belts.join(", ")}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}


