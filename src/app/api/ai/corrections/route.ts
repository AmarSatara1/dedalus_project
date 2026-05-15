import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

type Correction = {
  type: string;
  text: string;
};

const MEDICAL_FACTS: Correction[] = [
  {
    type: "drug-safety",
    text: "Acetaminophen should generally stay below 4 grams per day in adults to reduce the risk of liver toxicity.",
  },
  {
    type: "vital-signs",
    text: "A resting oxygen saturation below 92 percent can be a sign that further respiratory assessment is needed.",
  },
  {
    type: "infection",
    text: "Fever plus new confusion in an older adult can be an important sign of systemic infection.",
  },
  {
    type: "cardiology",
    text: "Chest pain associated with exertion, diaphoresis, or radiation to the arm warrants evaluation for cardiac ischemia.",
  },
  {
    type: "neurology",
    text: "A sudden focal neurologic deficit should be treated as a possible stroke until proven otherwise.",
  },
  {
    type: "hydration",
    text: "Orthostatic dizziness can be associated with dehydration, blood loss, or medication effects.",
  },
  {
    type: "antibiotics",
    text: "Antibiotics are not indicated for most uncomplicated viral upper respiratory infections.",
  },
  {
    type: "renal",
    text: "Reduced urine output together with edema or rising creatinine can suggest worsening kidney function.",
  },
];

function getDeterministicCorrections(report: string): Correction[] {
  const hash = createHash("sha256").update(report).digest();
  const count = hash[0] % 4;

  if (count === 0) {
    return [];
  }

  const chosenIndexes = new Set<number>();
  let cursor = 1;

  while (chosenIndexes.size < count) {
    const index = hash[cursor % hash.length] % MEDICAL_FACTS.length;
    chosenIndexes.add(index);
    cursor += 1;
  }

  return [...chosenIndexes].map((index) => MEDICAL_FACTS[index]);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    content?: unknown;
  } | null;

  if (!body || typeof body.content !== "string") {
    return NextResponse.json(
      { error: 'The request body must include a "content" string.' },
      { status: 400 },
    );
  }

  // simulating network response, not for production
  await new Promise((resolve) =>
    setTimeout(resolve, 3000 + Math.random() * 8000),
  );

  const corrections = getDeterministicCorrections(body.content);

  return NextResponse.json({ data: { corrections } });
}
