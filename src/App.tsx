import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { RefreshCw, Sparkles, X, Download, SwitchCamera, ZoomIn, ZoomOut, Upload, Image as ImageIcon, CreditCard, Wand2, Eye, Aperture, Heart, Star, Camera, Crown, Home, ChevronLeft, UserSquare, Video, Circle, Square, Settings, Shirt, GraduationCap } from 'lucide-react';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const STYLES = [
  { name: "Clean Girl", icon: <Sparkles size={20} strokeWidth={1.5} />, prompt: "Keep the person's identity identical. Apply a 'Clean girl' aesthetic filter, flawless dewy glass skin, minimal natural makeup, brushed up brows, glossy lips, soft flattering sunlight, photorealistic portrait, 8k resolution, highly detailed." },
  { name: "Bold Glam", icon: <Crown size={20} strokeWidth={1.5} />, prompt: "Keep the person's identity identical. Apply a bold glam makeup filter, sharp face contour, dramatic eyelashes, winged eyeliner, matte lips, studio ring light, flawless skin, professional beauty photography, 8k." },
  { name: "Douyin", icon: <Heart size={20} strokeWidth={1.5} />, prompt: "Keep the person's identity identical. Apply a trendy Douyin makeup filter, manhua lashes, glittery eyeshadow, gradient blurred lips, pale smooth skin, soft focus, ethereal lighting, highly detailed portrait." },
  { name: "Vintage", icon: <Camera size={20} strokeWidth={1.5} />, prompt: "Keep the person's identity identical. Apply a 90s vintage disposable camera filter, film grain, light leaks, slightly faded colors, nostalgic aesthetic, direct flash photography look, polaroid style." },
  { name: "K-Pop", icon: <Star size={20} strokeWidth={1.5} />, prompt: "Keep the person's identity identical. Apply a K-Pop idol stage look, vibrant neon rim lighting, glitter makeup, high contrast, trendy music video aesthetic, professional stage photography." },
];

const ROOM_ANGLES = [
  { name: "Wide Angle", thumb: "https://picsum.photos/seed/roomwide/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Flawlessly and cleanly replace the background with a cozy room from a wide-angle perspective. The integration must be absolutely seamless, hyper-realistic, with perfect lighting and shadow matching so it looks 100% real and unedited. Include framed photos of the user in the background." },
  { name: "Corner View", thumb: "https://picsum.photos/seed/roomcorner/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Flawlessly and cleanly replace the background with a cozy room from a corner perspective. The integration must be absolutely seamless, hyper-realistic, with perfect lighting and shadow matching so it looks 100% real and unedited. Include framed photos of the user in the background." },
  { name: "High Angle", thumb: "https://picsum.photos/seed/roomhigh/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Flawlessly and cleanly replace the background with a cozy room from a high-angle perspective. The integration must be absolutely seamless, hyper-realistic, with perfect lighting and shadow matching so it looks 100% real and unedited. Include framed photos of the user in the background." },
  { name: "Low Angle", thumb: "https://picsum.photos/seed/roomlow/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Flawlessly and cleanly replace the background with a cozy room from a low-angle perspective. The integration must be absolutely seamless, hyper-realistic, with perfect lighting and shadow matching so it looks 100% real and unedited. Include framed photos of the user in the background." },
  { name: "Close Up", thumb: "https://picsum.photos/seed/roomclose/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Flawlessly and cleanly replace the background with a cozy room from a close-up perspective. The integration must be absolutely seamless, hyper-realistic, with perfect lighting and shadow matching so it looks 100% real and unedited. Include framed photos of the user in the background." },
];

const ID_PHOTOS = [
  { name: "1x1 White", thumb: "https://picsum.photos/seed/1x1w/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal 1x1 ID photo. The subject must be facing forward with a neutral expression. Change the background to a solid pure white color. Ensure flat, even, professional studio lighting suitable for a government ID. Do not distort the face.", aspectRatio: "1:1" },
  { name: "1x1 Blue", thumb: "https://picsum.photos/seed/1x1b/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal 1x1 ID photo. The subject must be facing forward with a neutral expression. Change the background to a solid professional blue color. Ensure flat, even, professional studio lighting suitable for a government ID. Do not distort the face.", aspectRatio: "1:1" },
  { name: "1x1 Formal W", thumb: "https://picsum.photos/seed/1x1fw/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal 1x1 ID photo. Change the subject's clothing to a highly realistic, professional formal business suit or formal attire. The subject must be facing forward with a neutral expression. Change the background to a solid pure white color. Ensure flat, even, professional studio lighting suitable for a government ID. Do not distort the face.", aspectRatio: "1:1" },
  { name: "1x1 Formal B", thumb: "https://picsum.photos/seed/1x1fb/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal 1x1 ID photo. Change the subject's clothing to a highly realistic, professional formal business suit or formal attire. The subject must be facing forward with a neutral expression. Change the background to a solid professional blue color. Ensure flat, even, professional studio lighting suitable for a government ID. Do not distort the face.", aspectRatio: "1:1" },
  { name: "2x2 White", thumb: "https://picsum.photos/seed/2x2w/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal 2x2 ID photo. The subject must be facing forward with a neutral expression. Change the background to a solid pure white color. Ensure flat, even, professional studio lighting suitable for a government ID. Do not distort the face.", aspectRatio: "1:1" },
  { name: "2x2 Blue", thumb: "https://picsum.photos/seed/2x2b/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal 2x2 ID photo. The subject must be facing forward with a neutral expression. Change the background to a solid professional blue color. Ensure flat, even, professional studio lighting suitable for a government ID. Do not distort the face.", aspectRatio: "1:1" },
  { name: "2x2 Formal W", thumb: "https://picsum.photos/seed/2x2fw/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal 2x2 ID photo. Change the subject's clothing to a highly realistic, professional formal business suit or formal attire. The subject must be facing forward with a neutral expression. Change the background to a solid pure white color. Ensure flat, even, professional studio lighting suitable for a government ID. Do not distort the face.", aspectRatio: "1:1" },
  { name: "2x2 Formal B", thumb: "https://picsum.photos/seed/2x2fb/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal 2x2 ID photo. Change the subject's clothing to a highly realistic, professional formal business suit or formal attire. The subject must be facing forward with a neutral expression. Change the background to a solid professional blue color. Ensure flat, even, professional studio lighting suitable for a government ID. Do not distort the face.", aspectRatio: "1:1" },
  { name: "Pass White", thumb: "https://picsum.photos/seed/passw/100/133", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal passport photo. The subject must be facing forward with a neutral expression. Change the background to a solid pure white color. Ensure flat, even, professional studio lighting suitable for a passport. Do not distort the face.", aspectRatio: "3:4" },
  { name: "Pass Blue", thumb: "https://picsum.photos/seed/passb/100/133", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal passport photo. The subject must be facing forward with a neutral expression. Change the background to a solid professional blue color. Ensure flat, even, professional studio lighting suitable for a passport. Do not distort the face.", aspectRatio: "3:4" },
  { name: "Pass Formal W", thumb: "https://picsum.photos/seed/passfw/100/133", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal passport photo. Change the subject's clothing to a highly realistic, professional formal business suit or formal attire. The subject must be facing forward with a neutral expression. Change the background to a solid pure white color. Ensure flat, even, professional studio lighting suitable for a passport. Do not distort the face.", aspectRatio: "3:4" },
  { name: "Pass Formal B", thumb: "https://picsum.photos/seed/passfb/100/133", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a formal passport photo. Change the subject's clothing to a highly realistic, professional formal business suit or formal attire. The subject must be facing forward with a neutral expression. Change the background to a solid professional blue color. Ensure flat, even, professional studio lighting suitable for a passport. Do not distort the face.", aspectRatio: "3:4" },
  { name: "Social Profile", thumb: "https://picsum.photos/seed/social/100/100", prompt: "Keep the person's identity and facial likeness exactly identical to the original photo. Convert this selfie into a highly professional, formal social media profile picture (like LinkedIn). Change the subject's clothing to a stylish formal business suit or smart casual attire. The background should be a blurred, modern aesthetic office or cafe. Ensure flattering, high-end portrait lighting.", aspectRatio: "1:1" },
];

const GRADUATION = [
  { name: 'Classic Black', prompt: 'Change clothing to a highly realistic classic black graduation gown and cap (toga) with a gold tassel, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradblack/100/100' },
  { name: 'Navy Blue', prompt: 'Change clothing to a highly realistic navy blue graduation gown and cap, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradnavy/100/100' },
  { name: 'White Gown', prompt: 'Change clothing to a highly realistic white graduation gown and cap, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradwhite/100/100' },
  { name: 'Maroon Gown', prompt: 'Change clothing to a highly realistic maroon/burgundy graduation gown and cap, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradmaroon/100/100' },
  { name: 'Forest Green', prompt: 'Change clothing to a highly realistic forest green graduation gown and cap, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradgreen/100/100' },
  { name: 'PhD Velvet', prompt: 'Change clothing to a highly realistic PhD doctoral robe with velvet panels and bell sleeves, tam cap, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradphd/100/100' },
  { name: 'Master Hood', prompt: 'Change clothing to a highly realistic Master\'s degree graduation gown with a colorful academic hood, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradmaster/100/100' },
  { name: 'Med School', prompt: 'Change clothing to a highly realistic graduation gown worn over a doctor\'s white coat with a stethoscope, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradmed/100/100' },
  { name: 'Law School', prompt: 'Change clothing to a highly realistic Juris Doctor graduation gown with purple velvet trim, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradlaw/100/100' },
  { name: 'With Diploma', prompt: 'Change clothing to a highly realistic graduation gown and cap, subject is holding a rolled diploma with a ribbon, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/graddiploma/100/100' },
  { name: 'Campus BG', prompt: 'Change clothing to a highly realistic graduation gown and cap, background is a beautiful sunny university campus with brick buildings, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradcampus/100/100' },
  { name: 'Stage BG', prompt: 'Change clothing to a highly realistic graduation gown and cap, background is a formal graduation stage with curtains and warm lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradstage/100/100' },
  { name: 'With Flowers', prompt: 'Change clothing to a highly realistic graduation gown and cap, subject is holding a beautiful bouquet of flowers, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradflowers/100/100' },
  { name: 'Honor Cords', prompt: 'Change clothing to a highly realistic graduation gown and cap, wearing multiple gold honor cords around the neck, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradcords/100/100' },
  { name: 'Valedictorian', prompt: 'Change clothing to a highly realistic graduation gown and cap, wearing a prominent valedictorian stole sash, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradstole/100/100' },
  { name: 'Vintage', prompt: 'Change clothing to a highly realistic graduation gown and cap, apply a vintage 1990s film camera aesthetic with slight grain and warm tones, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradvintage/100/100' },
  { name: 'Cinematic', prompt: 'Change clothing to a highly realistic graduation gown and cap, dramatic cinematic lighting with rim lights and deep shadows, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradcinematic/100/100' },
  { name: 'Pop Art', prompt: 'Change clothing to a graduation gown and cap, apply a vibrant colorful pop-art aesthetic with bold colors, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradpop/100/100' },
  { name: 'Silver Tassel', prompt: 'Change clothing to a highly realistic black graduation gown and cap with a silver tassel, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradsilver/100/100' },
  { name: 'Red Gown', prompt: 'Change clothing to a highly realistic bright red graduation gown and cap, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/gradred/100/100' }
];

const UNIFORMS = [
  { name: 'Graduation', prompt: 'Change clothing to a highly realistic graduation gown and cap (toga), professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/grad/100/100' },
  { name: 'Police', prompt: 'Change clothing to a highly realistic police officer uniform with badge, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/police/100/100' },
  { name: 'Pilot', prompt: 'Change clothing to a highly realistic airline pilot uniform with captain epaulets, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/pilot/100/100' },
  { name: 'Army', prompt: 'Change clothing to a highly realistic military army camouflage uniform, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/army/100/100' },
  { name: 'Doctor', prompt: 'Change clothing to a highly realistic doctor with a white lab coat and stethoscope, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/doctor/100/100' },
  { name: 'Teacher', prompt: 'Change clothing to a highly realistic professional teacher outfit, smart casual, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/teacher/100/100' },
  { name: 'Nurse', prompt: 'Change clothing to a highly realistic medical nurse scrubs, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/nurse/100/100' },
  { name: 'Firefighter', prompt: 'Change clothing to a highly realistic firefighter turnout gear, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/firefighter/100/100' },
  { name: 'Chef', prompt: 'Change clothing to a highly realistic executive chef uniform with a white coat, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/chef/100/100' },
  { name: 'Flight Att.', prompt: 'Change clothing to a highly realistic elegant flight attendant uniform, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/flightattendant/100/100' },
  { name: 'Executive', prompt: 'Change clothing to a highly realistic tailored business suit, corporate executive style, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/suit/100/100' },
  { name: 'Lawyer', prompt: 'Change clothing to a highly realistic lawyer attire, formal courtroom suit, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/lawyer/100/100' },
  { name: 'Engineer', prompt: 'Change clothing to a highly realistic construction engineer with a hard hat and safety vest, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/engineer/100/100' },
  { name: 'Astronaut', prompt: 'Change clothing to a highly realistic astronaut space suit, cinematic lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/astronaut/100/100' },
  { name: 'Navy Sailor', prompt: 'Change clothing to a highly realistic navy sailor uniform, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/navy/100/100' },
  { name: 'Paramedic', prompt: 'Change clothing to a highly realistic EMT paramedic uniform, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/paramedic/100/100' },
  { name: 'Mechanic', prompt: 'Change clothing to a highly realistic auto mechanic coveralls, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/mechanic/100/100' },
  { name: 'Scientist', prompt: 'Change clothing to a highly realistic scientist in a clean white lab coat with safety glasses, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/scientist/100/100' },
  { name: 'Athlete', prompt: 'Change clothing to a highly realistic professional sports athlete uniform, athletic fit, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/athlete/100/100' },
  { name: 'Barista', prompt: 'Change clothing to a highly realistic cafe barista uniform with an apron, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/barista/100/100' },
  { name: 'Judge', prompt: 'Change clothing to a highly realistic judge robe, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/judge/100/100' },
  { name: 'Surgeon', prompt: 'Change clothing to highly realistic surgeon scrubs with a surgical mask pulled down, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/surgeon/100/100' },
  { name: 'Architect', prompt: 'Change clothing to a highly realistic architect smart casual outfit holding blueprints, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/architect/100/100' },
  { name: 'Detective', prompt: 'Change clothing to a highly realistic detective trench coat, cinematic lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/detective/100/100' },
  { name: 'News Anchor', prompt: 'Change clothing to a highly realistic news anchor formal suit, professional studio lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/newsanchor/100/100' },
  { name: 'Dentist', prompt: 'Change clothing to a highly realistic dentist in scrubs with dental loupe glasses, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/dentist/100/100' },
  { name: 'Veterinarian', prompt: 'Change clothing to a highly realistic veterinarian in scrubs holding a small cute puppy or kitten, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/vet/100/100' },
  { name: 'Pharmacist', prompt: 'Change clothing to a highly realistic pharmacist in a white coat standing in a pharmacy, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/pharmacist/100/100' },
  { name: 'Software Dev', prompt: 'Change clothing to a highly realistic software developer in a casual tech company hoodie, modern office background, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/dev/100/100' },
  { name: 'Inv. Banker', prompt: 'Change clothing to a highly realistic investment banker in a high-end pinstripe suit and tie, Wall Street office background, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/banker/100/100' },
  { name: 'Real Estate', prompt: 'Change clothing to a highly realistic real estate agent in a sharp blazer, standing in a luxury home, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/realestate/100/100' },
  { name: 'Military Gen.', prompt: 'Change clothing to a highly realistic military general uniform with multiple medals and ribbons, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/general/100/100' },
  { name: 'SWAT Officer', prompt: 'Change clothing to a highly realistic SWAT police officer in tactical gear, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/swat/100/100' },
  { name: 'Construction', prompt: 'Change clothing to a highly realistic construction worker in a high-visibility jacket and hard hat, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/construction/100/100' },
  { name: 'Electrician', prompt: 'Change clothing to a highly realistic electrician with a tool belt, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/electrician/100/100' },
  { name: 'Sushi Chef', prompt: 'Change clothing to a highly realistic traditional sushi chef uniform (itamae), professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/sushichef/100/100' },
  { name: 'Baker', prompt: 'Change clothing to a highly realistic baker with a white apron covered in a little flour, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/baker/100/100' },
  { name: 'Vintage Flight', prompt: 'Change clothing to a highly realistic 1960s vintage flight attendant uniform, retro aesthetic, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/vintageflight/100/100' },
  { name: 'Spacewalk', prompt: 'Change clothing to a highly realistic astronaut in an EVA spacewalk suit with Earth in the background, cinematic lighting, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/spacewalk/100/100' },
  { name: 'Race Driver', prompt: 'Change clothing to a highly realistic professional race car driver fire suit with sponsor patches, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/racer/100/100' },
  { name: 'Comm. Diver', prompt: 'Change clothing to a highly realistic commercial deep sea diver suit, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/diver/100/100' },
  { name: 'Zookeeper', prompt: 'Change clothing to a highly realistic zookeeper uniform in khaki, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/zookeeper/100/100' },
  { name: 'Park Ranger', prompt: 'Change clothing to a highly realistic national park ranger uniform with a campaign hat, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/ranger/100/100' },
  { name: 'Librarian', prompt: 'Change clothing to a highly realistic librarian in smart casual attire with reading glasses, library background, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/librarian/100/100' },
  { name: 'Curator', prompt: 'Change clothing to a highly realistic museum curator in an elegant blazer, art gallery background, professional photography, strictly maintaining exact facial likeness and identity.', thumb: 'https://picsum.photos/seed/curator/100/100' }
];

const BACKGROUNDS = [
  { name: "Studio", thumb: "https://picsum.photos/seed/studio/100/100" },
  { name: "Neon", thumb: "https://picsum.photos/seed/neon/100/100" },
  { name: "Beach", thumb: "https://picsum.photos/seed/beach/100/100" },
  { name: "Paris", thumb: "https://picsum.photos/seed/paris/100/100" },
  { name: "Tokyo", thumb: "https://picsum.photos/seed/tokyo/100/100" },
  { name: "Cabin", thumb: "https://picsum.photos/seed/cabin/100/100" },
  { name: "Office", thumb: "https://picsum.photos/seed/office/100/100" },
  { name: "Mountain", thumb: "https://picsum.photos/seed/mountain/100/100" },
  { name: "Night Sky", thumb: "https://picsum.photos/seed/nightsky/100/100" },
  { name: "Forest", thumb: "https://picsum.photos/seed/forest/100/100" },
  { name: "Autumn", thumb: "https://picsum.photos/seed/autumn/100/100" },
  { name: "Winter", thumb: "https://picsum.photos/seed/winter/100/100" },
  { name: "Car", thumb: "https://picsum.photos/seed/car/100/100" },
  { name: "Cafe", thumb: "https://picsum.photos/seed/cafe/100/100" },
  { name: "Gallery", thumb: "https://picsum.photos/seed/gallery/100/100" },
  { name: "Cyberpunk", thumb: "https://picsum.photos/seed/cyberpunk/100/100" },
  { name: "Castle", thumb: "https://picsum.photos/seed/castle/100/100" },
  { name: "Underwater", thumb: "https://picsum.photos/seed/underwater/100/100" },
  { name: "Mars", thumb: "https://picsum.photos/seed/mars/100/100" },
  { name: "Abstract", thumb: "https://picsum.photos/seed/abstract/100/100" }
];

const ENHANCEMENT_PRESETS = [
  { name: 'Natural', filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' },
  { name: 'Glamour', filter: 'brightness(1.1) contrast(1.1) saturate(1.2) sepia(0.1) blur(0.5px)' },
  { name: 'Cinematic', filter: 'contrast(1.2) saturate(0.8) sepia(0.2) hue-rotate(-10deg)' },
  { name: 'Vibrant', filter: 'contrast(1.1) saturate(1.4)' },
  { name: 'Vintage', filter: 'sepia(0.5) contrast(0.9) brightness(0.9)' },
  { name: 'None', filter: 'none' }
];

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);
  const [isZoomSupported, setIsZoomSupported] = useState(false);
  
  const [isAutoEnhanceEnabled, setIsAutoEnhanceEnabled] = useState(true);
  const [showPresets, setShowPresets] = useState(false);
  const [isAutoEnhancing, setIsAutoEnhancing] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video recording state
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  const [selectedPreset, setSelectedPreset] = useState('Natural');
  const requestRef = useRef<number>();
  const isRecordingRef = useRef(false);
  const currentPresetRef = useRef(ENHANCEMENT_PRESETS[0]);
  const facingModeRef = useRef<'user' | 'environment'>('user');

  useEffect(() => {
    currentPresetRef.current = ENHANCEMENT_PRESETS.find(p => p.name === selectedPreset) || ENHANCEMENT_PRESETS[0];
  }, [selectedPreset]);

  useEffect(() => {
    facingModeRef.current = facingMode;
    if (facingMode === 'user' && selectedPreset === 'None') {
      setSelectedPreset('Natural'); // Auto-beautify for selfies
    }
  }, [facingMode, selectedPreset]);

  const applyAIEffect = async (effectPrompt: string, aspectRatio?: string) => {
    if (!capturedImage) return;
    setIsProcessingAI(true);
    setError(null);
    try {
      const base64Data = capturedImage.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: effectPrompt,
          },
        ],
        config: aspectRatio ? { imageConfig: { aspectRatio } as any } : undefined
      });

      let foundImage = false;
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const imageUrl = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
          setCapturedImage(imageUrl);
          foundImage = true;
          break;
        }
      }
      if (!foundImage) {
        setError("AI failed to process the image. Please try again.");
      }
    } catch (err) {
      console.error("AI Effect error:", err);
      setError("AI processing failed. Please check your connection.");
    } finally {
      setIsProcessingAI(false);
      setActiveMenu(null);
    }
  };

  const startCamera = async (mode = facingMode, quality = videoQuality, cMode = captureMode) => {
    try {
      let width = 1920;
      let height = 1080;
      if (quality === '720p') { width = 1280; height = 720; }
      else if (quality === '4k') { width = 3840; height = 2160; }

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: mode,
            width: { ideal: width },
            height: { ideal: height }
          },
          audio: cMode === 'video',
        });
      } catch (initialErr: any) {
        // Fallback to video only if audio fails (e.g. no mic or mic permission denied)
        if (cMode === 'video' && (initialErr.name === 'NotAllowedError' || initialErr.name === 'NotFoundError')) {
          console.warn("Failed to get audio, trying video only", initialErr);
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: mode,
              width: { ideal: width },
              height: { ideal: height }
            },
            audio: false,
          });
        } else {
          throw initialErr;
        }
      }

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check for zoom capabilities
      const track = mediaStream.getVideoTracks()[0];
      if ('getCapabilities' in track) {
        const capabilities = track.getCapabilities() as any;
        if (capabilities.zoom) {
          setIsZoomSupported(true);
          setMinZoom(capabilities.zoom.min || 1);
          setMaxZoom(capabilities.zoom.max || 3);
          setZoom((track.getSettings() as any).zoom || capabilities.zoom.min || 1);
        } else {
          setIsZoomSupported(false);
        }
      } else {
        setIsZoomSupported(false);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
        setError("Camera access denied. Please enable permissions in your browser settings (site settings -> camera/microphone) and reload the page.");
      } else {
        setError("Could not access camera. Please ensure your device has a working camera.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleCamera = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    stopCamera();
    startCamera(newMode, videoQuality, captureMode);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = Number(e.target.value);
    setZoom(newZoom);
    if (stream) {
      const track = stream.getVideoTracks()[0];
      track.applyConstraints({ advanced: [{ zoom: newZoom }] }).catch(err => {
        console.error("Zoom failed", err);
      });
    }
  };

  useEffect(() => {
    startCamera(facingMode, videoQuality, captureMode);
    return () => stopCamera();
  }, [captureMode, videoQuality]);

  const autoEnhanceImage = async (base64Data: string) => {
    setIsAutoEnhancing(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: "Professional photo enhancement: improve lighting, color balance, and clarity. Subtly retouch skin and facial features for a clean, high-quality look. Return only the enhanced image data.",
          },
        ],
      });

      let foundImage = false;
      const parts = response.candidates?.[0]?.content?.parts || [];
      
      for (const part of parts) {
        if (part.inlineData?.data) {
          const imageUrl = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
          setCapturedImage(imageUrl);
          foundImage = true;
          break;
        }
      }
      
      if (!foundImage) {
        const textResponse = response.text;
        console.warn("Auto-enhance did not return an image part. Model said:", textResponse);
        // Fallback: keep the original captured image (already set in capturePhoto)
      }
    } catch (err) {
      console.error("Auto-enhance error:", err);
    } finally {
      setIsAutoEnhancing(false);
    }
  };

  const startRecording = () => {
    if (!stream || !videoRef.current || !canvasRef.current) return;
    recordedChunksRef.current = [];
    isRecordingRef.current = true;
    setIsRecording(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const drawFrame = () => {
      if (!isRecordingRef.current) return;
      const ctx = canvas.getContext('2d');
      if (ctx && video.videoWidth > 0) {
        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        ctx.filter = currentPresetRef.current.filter;
        
        ctx.save();
        if (facingModeRef.current === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
      requestRef.current = requestAnimationFrame(drawFrame);
    };
    requestRef.current = requestAnimationFrame(drawFrame);

    try {
      const canvasStream = canvas.captureStream(30);
      const audioTracks = stream.getAudioTracks();
      const finalStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioTracks
      ]);

      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      const recorder = new MediaRecorder(finalStream, MediaRecorder.isTypeSupported(options.mimeType) ? options : undefined);
      mediaRecorderRef.current = recorder;
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        stopCamera();
      };
      
      recorder.start();
    } catch (err) {
      console.error("Recording failed", err);
      setError("Video recording is not supported or failed on this browser.");
      isRecordingRef.current = false;
      setIsRecording(false);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      isRecordingRef.current = false;
      setIsRecording(false);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  };

  const handleCaptureClick = () => {
    if (captureMode === 'photo') {
      capturePhoto();
    } else {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.filter = currentPresetRef.current.filter;
        if (facingMode === 'user') {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(base64Image);
        stopCamera();
        const base64Data = base64Image.split(',')[1];
        if (isAutoEnhanceEnabled) {
          autoEnhanceImage(base64Data);
        }
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
      setRecordedVideo(null);
    }
    setError(null);
    setActiveMenu(null);
    startCamera(facingMode, videoQuality, captureMode);
  };

  const handleDownload = () => {
    if (recordedVideo) {
      const a = document.createElement('a');
      a.href = recordedVideo;
      a.download = `pixme-video-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const imageToDownload = capturedImage;
      if (imageToDownload) {
        const a = document.createElement('a');
        a.href = imageToDownload;
        a.download = `pixme-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  return (
    <div className="bg-black text-white h-[100dvh] w-full overflow-hidden flex flex-col relative font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <div className="absolute top-0 w-full p-4 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => setIsAutoEnhanceEnabled(!isAutoEnhanceEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all ${
            isAutoEnhanceEnabled 
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
              : 'bg-black/40 border-white/10 text-white/60'
          }`}
        >
          <Wand2 size={14} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-wider font-bold">
            Auto-Enhance: {isAutoEnhanceEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        <div className="flex items-center gap-3">
          {captureMode === 'photo' && (
            <button 
              onClick={() => setShowPresets(!showPresets)}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                showPresets 
                  ? 'bg-white/20 border-white/40 text-white' 
                  : 'bg-black/40 border-white/10 text-white/60'
              }`}
              title="Sample Presets"
            >
              <Sparkles size={18} strokeWidth={1.5} />
            </button>
          )}
          
          <button
            onClick={toggleCamera}
            disabled={isRecording}
            className={`bg-black/40 p-2.5 rounded-full text-white/90 backdrop-blur-md transition-colors border border-white/10 ${isRecording ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/60'}`}
            aria-label="Toggle Camera"
          >
            <SwitchCamera size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Presets Menu (Top) */}
      {showPresets && captureMode === 'photo' && !capturedImage && !recordedVideo && (
        <div className="absolute top-20 left-0 w-full px-4 py-3 z-40 bg-black/40 backdrop-blur-md border-b border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide justify-center">
            {ENHANCEMENT_PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => setSelectedPreset(preset.name)}
                className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider font-bold whitespace-nowrap transition-all ${
                  selectedPreset === preset.name 
                    ? 'bg-white text-black shadow-lg' 
                    : 'bg-white/5 text-white/60 border border-white/5 hover:bg-white/10'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 relative flex items-center justify-center bg-zinc-900 w-full h-full overflow-hidden">
        
        {/* Camera Stream */}
        {!capturedImage && !recordedVideo && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted={captureMode === 'video'} // Mute local playback to avoid feedback
            style={{ 
              filter: ENHANCEMENT_PRESETS.find(p => p.name === selectedPreset)?.filter || 'none',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Captured Image */}
        {capturedImage && !recordedVideo && (
          <img 
            src={capturedImage} 
            className="absolute inset-0 w-full h-full object-contain" 
            alt="Captured photo" 
          />
        )}

        {/* Recorded Video */}
        {recordedVideo && (
          <video 
            src={recordedVideo} 
            controls 
            autoPlay 
            loop 
            className="absolute inset-0 w-full h-full object-contain" 
          />
        )}
        
        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Loading Overlay for Auto-Enhance */}
        {(isAutoEnhancing || isProcessingAI) && (
          <div className="absolute inset-0 bg-black/60 z-30 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="relative flex justify-center items-center">
              <div className="absolute w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin z-10"></div>
              <div className="absolute w-20 h-20 rounded-full bg-purple-500/30 blur-md animate-pulse"></div>
            </div>
            <p className="mt-6 font-semibold text-lg animate-pulse tracking-wide text-purple-300">
              {isAutoEnhancing ? 'Auto-Enhancing...' : 'Applying Magic...'}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute top-20 left-4 right-4 bg-red-500/90 text-white p-4 rounded-xl z-40 backdrop-blur-md shadow-lg flex items-start justify-between">
            <p className="text-sm font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-4 text-white/80 hover:text-white">
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Capture Button Container */}
        {!capturedImage && !recordedVideo && (
          <div className="absolute bottom-0 w-full p-8 flex flex-col items-center gap-6 bg-gradient-to-t from-black/80 to-transparent z-20">
            {/* Photo/Video Toggle */}
            {!isRecording && (
              <div className="flex gap-1 bg-black/40 p-1 rounded-full backdrop-blur-md border border-white/5">
                <button 
                  onClick={() => setCaptureMode('photo')}
                  className={`px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${captureMode === 'photo' ? 'bg-white text-black shadow-md' : 'text-white/40 hover:text-white/70'}`}
                >
                  Photo
                </button>
                <button 
                  onClick={() => setCaptureMode('video')}
                  className={`px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${captureMode === 'video' ? 'bg-white text-black shadow-md' : 'text-white/40 hover:text-white/70'}`}
                >
                  Video
                </button>
              </div>
            )}

            <button 
              onClick={handleCaptureClick}
              className={`w-20 h-20 rounded-full border-4 shadow-2xl active:scale-95 transition-all flex items-center justify-center ${
                captureMode === 'video' 
                  ? 'border-red-500/50 bg-red-500/10' 
                  : 'border-white/50 bg-white/10'
              }`}
            >
              {captureMode === 'video' ? (
                <div className={`bg-red-500 transition-all ${isRecording ? 'w-8 h-8 rounded-md' : 'w-14 h-14 rounded-full'}`}></div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-white"></div>
              )}
            </button>
          </div>
        )}

        {/* AI Magic Menus (Bottom) */}
        {capturedImage && !recordedVideo && !isProcessingAI && (
          <div className="absolute bottom-0 w-full p-6 flex flex-col gap-4 bg-gradient-to-t from-black/90 to-transparent z-20">
            {/* Category Selector */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide justify-center">
              {[
                { id: 'graduation', label: 'Graduation', icon: <GraduationCap size={14} /> },
                { id: 'uniforms', label: 'Professions', icon: <Shirt size={14} /> },
                { id: 'backgrounds', label: 'Backgrounds', icon: <ImageIcon size={14} /> },
                { id: 'id', label: 'ID Photos', icon: <UserSquare size={14} /> },
                { id: 'angles', label: 'Angles', icon: <Eye size={14} /> },
                { id: 'styles', label: 'Styles', icon: <Sparkles size={14} /> },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveMenu(activeMenu === cat.id ? null : cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
                    activeMenu === cat.id 
                      ? 'bg-white text-black border-white' 
                      : 'bg-black/40 text-white/60 border-white/10 hover:bg-black/60'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Options List */}
            {activeMenu && (
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide animate-in fade-in slide-in-from-bottom-4 duration-300">
                {activeMenu === 'graduation' && GRADUATION.map(item => (
                  <button
                    key={item.name}
                    onClick={() => applyAIEffect(item.prompt)}
                    className="flex flex-col items-center gap-2 min-w-[70px] group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white/50 transition-all shadow-lg">
                      <img src={item.thumb} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[9px] uppercase tracking-tighter font-bold text-white/70 group-hover:text-white">{item.name}</span>
                  </button>
                ))}
                {activeMenu === 'uniforms' && UNIFORMS.map(item => (
                  <button
                    key={item.name}
                    onClick={() => applyAIEffect(item.prompt)}
                    className="flex flex-col items-center gap-2 min-w-[70px] group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white/50 transition-all shadow-lg">
                      <img src={item.thumb} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[9px] uppercase tracking-tighter font-bold text-white/70 group-hover:text-white">{item.name}</span>
                  </button>
                ))}
                {activeMenu === 'backgrounds' && BACKGROUNDS.map(item => (
                  <button
                    key={item.name}
                    onClick={() => applyAIEffect(`Keep the person's identity and facial likeness exactly identical to the original photo. Flawlessly and cleanly replace the background with a highly realistic ${item.name} setting. The integration must be absolutely seamless, with perfect lighting and shadow matching.`)}
                    className="flex flex-col items-center gap-2 min-w-[70px] group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white/50 transition-all shadow-lg">
                      <img src={item.thumb} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[9px] uppercase tracking-tighter font-bold text-white/70 group-hover:text-white">{item.name}</span>
                  </button>
                ))}
                {activeMenu === 'id' && ID_PHOTOS.map(item => (
                  <button
                    key={item.name}
                    onClick={() => applyAIEffect(item.prompt, item.aspectRatio)}
                    className="flex flex-col items-center gap-2 min-w-[70px] group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white/50 transition-all shadow-lg">
                      <img src={item.thumb} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[9px] uppercase tracking-tighter font-bold text-white/70 group-hover:text-white">{item.name}</span>
                  </button>
                ))}
                {activeMenu === 'angles' && ROOM_ANGLES.map(item => (
                  <button
                    key={item.name}
                    onClick={() => applyAIEffect(item.prompt)}
                    className="flex flex-col items-center gap-2 min-w-[70px] group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-white/50 transition-all shadow-lg">
                      <img src={item.thumb} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[9px] uppercase tracking-tighter font-bold text-white/70 group-hover:text-white">{item.name}</span>
                  </button>
                ))}
                {activeMenu === 'styles' && STYLES.map(item => (
                  <button
                    key={item.name}
                    onClick={() => applyAIEffect(item.prompt)}
                    className="flex flex-col items-center gap-2 min-w-[70px] group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border-2 border-transparent group-hover:border-white/50 transition-all shadow-lg">
                      {item.icon}
                    </div>
                    <span className="text-[9px] uppercase tracking-tighter font-bold text-white/70 group-hover:text-white">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Top Actions (Retake / Download) */}
        {(capturedImage || recordedVideo) && (
          <div className="absolute top-4 right-4 mt-16 flex gap-2 z-50">
            {(capturedImage || recordedVideo) && (
              <button 
                onClick={handleDownload}
                className="bg-blue-600/80 px-3 py-1.5 rounded-full text-xs backdrop-blur-md hover:bg-blue-600 transition-colors border border-blue-500/50 flex items-center gap-1.5"
              >
                <Download size={14} strokeWidth={1.5} /> Save
              </button>
            )}
            <button 
              onClick={retakePhoto}
              className="bg-black/50 px-3 py-1.5 rounded-full text-xs backdrop-blur-md hover:bg-black/70 transition-colors border border-white/20 flex items-center gap-1.5"
            >
              <X size={14} strokeWidth={1.5} /> Retake
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
