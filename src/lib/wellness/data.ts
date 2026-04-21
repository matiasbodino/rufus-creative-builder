export type MealSlot = "breakfast" | "lunch" | "snack" | "dinner";

export interface MealOption {
  id: string;
  name: string;
  kcal: number;
  macros: { p: number; c: number; f: number };
  description: string;
}

export interface MealPlan {
  slot: MealSlot;
  label: string;
  time: string;
  targetKcal: number;
  options: MealOption[];
}

export const MEAL_PLAN: MealPlan[] = [
  {
    slot: "breakfast",
    label: "Desayuno",
    time: "07:30",
    targetKcal: 450,
    options: [
      {
        id: "b1",
        name: "Avena + frutos rojos",
        kcal: 420,
        macros: { p: 18, c: 62, f: 10 },
        description: "60g avena, 200ml leche, 80g frutos rojos, 1 cda miel",
      },
      {
        id: "b2",
        name: "Tostadas de aguacate",
        kcal: 480,
        macros: { p: 20, c: 45, f: 22 },
        description: "2 rebanadas pan integral, 1/2 palta, 2 huevos pochados",
      },
      {
        id: "b3",
        name: "Yogur griego + granola",
        kcal: 440,
        macros: { p: 28, c: 48, f: 12 },
        description: "200g yogur griego, 40g granola casera, 1 plátano",
      },
    ],
  },
  {
    slot: "lunch",
    label: "Almuerzo",
    time: "13:00",
    targetKcal: 650,
    options: [
      {
        id: "l1",
        name: "Bowl de pollo + quinoa",
        kcal: 640,
        macros: { p: 45, c: 60, f: 18 },
        description: "150g pollo, 100g quinoa, verduras asadas, tahini",
      },
      {
        id: "l2",
        name: "Salmón al horno",
        kcal: 680,
        macros: { p: 42, c: 55, f: 25 },
        description: "160g salmón, boniato asado, espárragos",
      },
      {
        id: "l3",
        name: "Wrap de garbanzos",
        kcal: 620,
        macros: { p: 28, c: 78, f: 18 },
        description: "Tortilla integral, garbanzos, hummus, ensalada",
      },
    ],
  },
  {
    slot: "snack",
    label: "Merienda",
    time: "17:00",
    targetKcal: 250,
    options: [
      {
        id: "s1",
        name: "Smoothie proteico",
        kcal: 240,
        macros: { p: 25, c: 28, f: 4 },
        description: "1 scoop proteína, 1 plátano, 200ml leche vegetal",
      },
      {
        id: "s2",
        name: "Tostada integral + queso",
        kcal: 260,
        macros: { p: 14, c: 30, f: 10 },
        description: "1 tostada, queso fresco, tomate, aceite de oliva",
      },
      {
        id: "s3",
        name: "Mix de frutos secos",
        kcal: 280,
        macros: { p: 9, c: 18, f: 20 },
        description: "30g almendras, nueces y pasas",
      },
    ],
  },
  {
    slot: "dinner",
    label: "Cena",
    time: "20:30",
    targetKcal: 550,
    options: [
      {
        id: "d1",
        name: "Tortilla de verduras",
        kcal: 520,
        macros: { p: 30, c: 32, f: 26 },
        description: "3 huevos, calabacín, espinaca, papa hervida",
      },
      {
        id: "d2",
        name: "Pavo salteado + arroz",
        kcal: 580,
        macros: { p: 40, c: 62, f: 12 },
        description: "150g pavo, 120g arroz integral, brócoli",
      },
      {
        id: "d3",
        name: "Crema de calabaza + tofu",
        kcal: 510,
        macros: { p: 26, c: 48, f: 18 },
        description: "250ml crema, 120g tofu a la plancha, semillas",
      },
    ],
  },
];

export interface ExerciseStep {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  note?: string;
}

export interface Routine {
  id: string;
  name: string;
  focus: string;
  durationMin: number;
  level: "Principiante" | "Intermedio" | "Avanzado";
  exercises: ExerciseStep[];
}

export const ROUTINES: Routine[] = [
  {
    id: "r-full",
    name: "Full Body Express",
    focus: "Cuerpo completo",
    durationMin: 25,
    level: "Intermedio",
    exercises: [
      { id: "e1", name: "Sentadillas", sets: 4, reps: "15", restSec: 45 },
      { id: "e2", name: "Flexiones", sets: 4, reps: "12", restSec: 45, note: "Apoya rodillas si lo necesitas" },
      { id: "e3", name: "Zancadas alternas", sets: 3, reps: "10 c/pierna", restSec: 45 },
      { id: "e4", name: "Plancha alta", sets: 3, reps: "40 seg", restSec: 30 },
      { id: "e5", name: "Burpees", sets: 3, reps: "10", restSec: 60 },
    ],
  },
  {
    id: "r-core",
    name: "Core & Abs",
    focus: "Abdomen y core",
    durationMin: 15,
    level: "Principiante",
    exercises: [
      { id: "e1", name: "Plancha frontal", sets: 3, reps: "30 seg", restSec: 30 },
      { id: "e2", name: "Crunch", sets: 4, reps: "20", restSec: 30 },
      { id: "e3", name: "Mountain climbers", sets: 3, reps: "30 seg", restSec: 30 },
      { id: "e4", name: "Russian twist", sets: 3, reps: "20", restSec: 30 },
      { id: "e5", name: "Elevación de piernas", sets: 3, reps: "15", restSec: 45 },
    ],
  },
  {
    id: "r-hiit",
    name: "HIIT Quemagrasas",
    focus: "Cardio de alta intensidad",
    durationMin: 20,
    level: "Avanzado",
    exercises: [
      { id: "e1", name: "Jumping jacks", sets: 4, reps: "45 seg", restSec: 15 },
      { id: "e2", name: "Sentadillas con salto", sets: 4, reps: "30 seg", restSec: 15 },
      { id: "e3", name: "Burpees", sets: 4, reps: "30 seg", restSec: 20 },
      { id: "e4", name: "Skaters", sets: 4, reps: "45 seg", restSec: 15 },
      { id: "e5", name: "High knees", sets: 4, reps: "30 seg", restSec: 20 },
    ],
  },
  {
    id: "r-mobility",
    name: "Movilidad & Estiramiento",
    focus: "Recuperación activa",
    durationMin: 18,
    level: "Principiante",
    exercises: [
      { id: "e1", name: "Gato-camello", sets: 3, reps: "10", restSec: 20 },
      { id: "e2", name: "Rotaciones de cadera", sets: 3, reps: "10 c/lado", restSec: 20 },
      { id: "e3", name: "Zancada con torsión", sets: 3, reps: "8 c/pierna", restSec: 20 },
      { id: "e4", name: "Perro boca abajo", sets: 3, reps: "40 seg", restSec: 20 },
      { id: "e5", name: "Respiración diafragmática", sets: 2, reps: "2 min", restSec: 0 },
    ],
  },
];
