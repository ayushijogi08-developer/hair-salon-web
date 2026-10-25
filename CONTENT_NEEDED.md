# Hair City Salon & Academy — Content Needed Checklist

> **Integrity Rule**: Hair City Salon & Academy never publishes fabricated facts, fake ratings, simulated reviews, or placeholder prices.  
> The sections listed below are fully coded, styled, and wired to render automatically the moment verified business data is provided with `"confirmed": true` in [`src/data/site.js`](./src/data/site.js).  
> While data arrays remain empty or unconfirmed, these sections safely render nothing—guaranteeing no empty headings, broken layouts, or blank spaces.

---

## 1. Service Pricing (`siteData.pricing`)

Add verified service menu rates to `src/data/site.js`.

### Required per item:
- [ ] **Category**: (e.g., `"Haircuts & Styling"`, `"Hair Colour"`, `"Treatments"`, `"Grooming"`)
- [ ] **Service Name**: (e.g., `"Men's Classic Cut & Styling"`, `"Global Colour"`)
- [ ] **From Price (₹)**: Starting rate in INR (e.g., `350`, `2500`)
- [ ] **One-line Description**: Brief note on what the service includes (e.g., `"Consultation, hair wash, precision cut, and finish."`)
- [ ] **Confirmation**: Set `confirmed: true` once verified with salon management.

### Fill-in Template:
```javascript
pricing: [
  {
    id: "p-01",
    category: "Haircuts & Styling",
    name: "Men's Precision Cut & Finish",
    priceFrom: 350,
    description: "Detailed consultation, scissor-over-comb cut, rinse, and blow-dry finish.",
    confirmed: true
  },
  {
    id: "p-02",
    category: "Haircuts & Styling",
    name: "Women's Multi-Layer Cut & Styling",
    priceFrom: 650,
    description: "Face-framing layers, split-end removal, and volume blowout.",
    confirmed: true
  },
  {
    id: "p-03",
    category: "Hair Treatments",
    name: "Intensive Restorative Hair Spa",
    priceFrom: 1200,
    description: "Scalp stimulation, deep steam infusion, and hydration mask.",
    confirmed: true
  }
]
```

---

## 2. Stylist & Educator Team (`siteData.team`)

Introduce the verified resident stylists and academy educators.

### Required per member:
- [ ] **Full Name**: Stylist / educator name
- [ ] **Role / Title**: (e.g., `"Senior Stylist & Creative Director"`, `"Colour Specialist"`, `"Academy Educator"`)
- [ ] **Years of Experience**: Verified salon experience (e.g., `"8+ years"`, `"5+ years"`)
- [ ] **Photo**: High-resolution portrait image file (placed in `public/assets/team/` or `src/assets/`)
- [ ] **Specialty / Bio**: 1–2 sentences on signature techniques or craft focus
- [ ] **Confirmation**: Set `confirmed: true`.

### Fill-in Template:
```javascript
team: [
  {
    id: "t-01",
    name: "Stylist Name",
    role: "Senior Stylist & Salon Director",
    experience: "8+ years",
    photo: "/assets/team/stylist-01.jpg",
    bio: "Specializing in precision scissor work, fade geometry, and custom textured cuts.",
    confirmed: true
  }
]
```

---

## 3. Real Client Reviews (`siteData.reviews`)

Display genuine reviews from clients who have visited the salon chairs.

### Required per review (4 to 6 real reviews recommended):
- [ ] **Review Text**: Exact, unedited quote from client
- [ ] **Author Name**: Client's verified name or Google reviewer display name
- [ ] **Source**: (e.g., `"Google Review"`)
- [ ] **Source URL**: Direct link to the review or salon Google Business Profile
- [ ] **Confirmation**: Set `confirmed: true`.

### Fill-in Template:
```javascript
reviews: [
  {
    id: "r-01",
    text: "Review text copied verbatim from Google Maps...",
    author: "Client Name",
    source: "Google Review",
    sourceUrl: "https://maps.google.com/?cid=9185693562963339062",
    confirmed: true
  }
]
```

---

## 4. Frequently Asked Questions (`siteData.faq`)

Provide helpful, accurate guidance on frequent client queries.

### Questions requiring verified answers:
- [ ] **Appointments vs Walk-ins**: Do clients need prior bookings, or are walk-ins welcomed?
- [ ] **Hair Colour Timing**: How long do global colour, balayage, or highlights typically take?
- [ ] **Treatment Aftercare**: What routine and shampoo/conditioner are advised after smoothening or nanoplasty?
- [ ] **Academy Admissions & Fees**: How often do new batches start, and how can students apply?
- [ ] **Confirmation**: Set `confirmed: true`.

### Fill-in Template:
```javascript
faq: [
  {
    id: "faq-01",
    question: "Do I need to book an appointment before visiting?",
    answer: "Walk-ins are warmly welcomed throughout our working hours (9:00 AM – 10:00 PM). However, for elaborate services like hair colour, smoothening, or peak evening hours, booking via WhatsApp ensures dedicated chair time.",
    confirmed: true
  },
  {
    id: "faq-02",
    question: "How long does a hair colour or balayage service take?",
    answer: "Standard root touch-ups take approximately 60–90 minutes. Complex lightening, highlights, and custom balayage work typically require 3 to 4.5 hours depending on initial hair thickness, base tone, and desired lift.",
    confirmed: true
  },
  {
    id: "faq-03",
    question: "What aftercare is required after smoothening or nanoplasty?",
    answer: "We recommend using sulfate-free cleansing care, avoiding tight hair ties for the first 48 hours, and scheduling a periodic restorative spa treatment to preserve shine and tensile strength.",
    confirmed: true
  },
  {
    id: "faq-04",
    question: "How are academy admissions structured and when do new batches start?",
    answer: "Academy batches run in small cohorts of 4 to 6 students to ensure one-on-one chair instruction. New cohorts start on the first Monday of each month. Contact our coordinator via WhatsApp for syllabus breakdowns and enrollment.",
    confirmed: true
  }
]
```

---

## 5. Before & After Transformations (`siteData.beforeAfter`)

Showcase genuine client transformations with comparison slider capability.

### Required per transformation:
- [ ] **Title**: Short description of the transformation (e.g., `"Caramel Balayage Transformation"`, `"Nanoplasty Hair Restoration"`)
- [ ] **Category**: (e.g., `"Colour"`, `"Restoration"`, `"Styling"`)
- [ ] **Before Photo**: High-resolution image of hair before treatment (must have client consent)
- [ ] **After Photo**: High-resolution image of final finished look under balanced salon lighting
- [ ] **Client Consent**: Written/verbal permission to feature their transformation on the website
- [ ] **Confirmation**: Set `confirmed: true`.

### Fill-in Template:
```javascript
beforeAfter: [
  {
    id: "ba-01",
    title: "Caramel Balayage & Blowout",
    category: "Colour",
    beforeSrc: "/assets/transformations/ba-01-before.jpg",
    afterSrc: "/assets/transformations/ba-01-after.jpg",
    confirmed: true
  }
]
```

---

## 6. Academy Details Strip (`siteData.academyDetails`)

Render key practical facts about the academy curriculum right above the academy CTA.

### Required details:
- [ ] **Duration**: (e.g., `"3 Months (Full-Time)"` or `"6 Weeks Intensive"`)
- [ ] **Fee Range**: (e.g., `"Shared on direct consultation"` or confirmed tuition fee)
- [ ] **Next Batch**: (e.g., `"1st of every month"` or upcoming enrollment date)
- [ ] **Certificate**: (e.g., `"Hair City Professional Academy Certification"`)
- [ ] **Confirmation**: Set `confirmed: true`.

### Fill-in Template:
```javascript
academyDetails: {
  duration: "3 Months (Full-Time)",
  feeRange: "Shared on consultation",
  nextBatch: "1st of every month",
  certificate: "Professional Salon Certification",
  confirmed: true
}
```

---

## How to Apply Changes

1. Open [`src/data/site.js`](./src/data/site.js).
2. Paste the confirmed data objects into the respective arrays/keys.
3. Ensure each item has `confirmed: true`.
4. Run `npm run build` to verify the bundle.
5. Deploy or reload the site. The sections will automatically mount and render with full animations, accessibility attributes, and responsive layouts.
