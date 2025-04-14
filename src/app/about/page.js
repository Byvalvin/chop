import Link from "next/link";
import PageContainer from "../../components/PageContainer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat">
      <PageContainer>
        <div className="flex items-center justify-center px-4">
          <div className="bg-[#fefcfb]/90 backdrop-blur-sm border border-teal-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow max-w-3xl py-16 px-6 text-gray-800">

            {/* Title and Introductory Text */}
            <h1 className="text-4xl font-bold text-teal-600 mb-2">About Chop</h1>
            <p className="text-md text-gray-500 mb-8">
              A love letter to the food that raised me.
            </p>

            {/* Image with wrapped text on the right */}
            <figure className="float-right ml-6 mb-8 rounded-xl overflow-hidden shadow w-1/3">
              <img
                src="/images/misc/kitchen-memory.jpg" // replace with a real path
                alt="A kitchen memory"
                className="w-full h-48 object-cover rounded-md"
              />
              <figcaption className="text-sm text-gray-500 mt-2 italic text-center">
                One of the kitchens of all time.
              </figcaption>
            </figure>

            {/* Main Text */}
            <p className="text-lg leading-relaxed mb-4">
              I was born in Nigeria and moved to Canada when I was 12. That shift across continents came with a lot of change &mdash; some exciting, some disorienting. One of the biggest things I found myself missing was the food. Not just the taste, but the culture, the feeling, the connection.
            </p>

            <p className="text-lg leading-relaxed mb-4">
              I&apos;m not a chef. But my mum, my grandma, and the women in my family are amazing cooks. Their cooking is full of flavor, history, and heart &mdash; passed down not through measurements, but through feel, intuition, and love. &quot;Just add this much&quot; or &quot;cook it until it smells right&quot; &mdash; it was never exact, but it was always perfect.
            </p>

            <p className="text-lg leading-relaxed mb-4">
              What I&apos;ve realized is that African and Caribbean food — while different — both carry deep roots and rich traditions. But somehow, they don&apos;t always show up in the everyday mix of global cuisine. Everyone knows tacos, sushi, or pasta — but have they ever tried egusi soup? Jollof? Callaloo? There&apos;s so much flavor out there waiting to be discovered.
            </p>

            <p className="text-lg leading-relaxed mb-4">
              <strong>Chop</strong> is my small way of preserving, sharing, and celebrating this food. Maybe it&apos;ll just be for me &mdash; a way to hold on to memories and learn from my mum. Or maybe someone else will discover something new and fall in love with a dish they&apos;ve never had before. Either way, it&apos;s a love letter to the food that shaped me.
            </p>

            <blockquote className="text-lg leading-relaxed italic border-l-4 border-teal-400 pl-4 text-gray-700 mt-8 mb-12">
              One day, I&apos;ll do a cook-a-thon with my mum. Document it all. Maybe finally learn to make a halfway decent imitation of the food that raised me.
            </blockquote>

            {/* CTA button */}
            <div className="text-center mt-8">
              <Link
                href="/"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-full transition"
                title="Go back to the homepage"
              >
                I came for food
              </Link>
              <p className="text-sm text-gray-500 mt-2">← Back To Home</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

export const metadata = {
  title: "About | Chop",
  description: "A love letter to the food that raised me.",
};
