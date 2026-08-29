import type { Question } from '../types';

import neet_2012 from './questions/neet_2012.json';
import neet_2013 from './questions/neet_2013.json';
import neet_2014 from './questions/neet_2014.json';
import neet_2015 from './questions/neet_2015.json';
import neet_2016 from './questions/neet_2016.json';
import neet_2017 from './questions/neet_2017.json';
import neet_2018 from './questions/neet_2018.json';
import neet_2019 from './questions/neet_2019.json';
import neet_2020 from './questions/neet_2020.json';
import neet_2021 from './questions/neet_2021.json';
import neet_2022 from './questions/neet_2022.json';
import neet_2023 from './questions/neet_2023.json';
import neet_2024 from './questions/neet_2024.json';
import neet_2025 from './questions/neet_2025.json';
import inicet_2020_nov from './questions/inicet_2020_nov.json';
import inicet_2021_may from './questions/inicet_2021_may.json';
import inicet_2021_nov from './questions/inicet_2021_nov.json';
import inicet_2022_may from './questions/inicet_2022_may.json';
import inicet_2022_nov from './questions/inicet_2022_nov.json';
import inicet_2023_may from './questions/inicet_2023_may.json';
import inicet_2023_nov from './questions/inicet_2023_nov.json';
import inicet_2024_may from './questions/inicet_2024_may.json';
import inicet_2024_nov from './questions/inicet_2024_nov.json';
import inicet_2025_may from './questions/inicet_2025_may.json';

const allRawBatches = [
  neet_2012,
  neet_2013,
  neet_2014,
  neet_2015,
  neet_2016,
  neet_2017,
  neet_2018,
  neet_2019,
  neet_2020,
  neet_2021,
  neet_2022,
  neet_2023,
  neet_2024,
  neet_2025,
  inicet_2020_nov,
  inicet_2021_may,
  inicet_2021_nov,
  inicet_2022_may,
  inicet_2022_nov,
  inicet_2023_may,
  inicet_2023_nov,
  inicet_2024_may,
  inicet_2024_nov,
  inicet_2025_may,
];

const VALID_SOURCE_TYPES = ['official', 'trusted', 'recalled'] as const;

function validateQuestion(q: unknown, index: number, batchName: string): q is Question {
  const obj = q as Record<string, unknown>;

  if (!obj || typeof obj !== 'object') {
    console.warn(`[${batchName}] Skipping item ${index}: not an object`);
    return false;
  }

  if (!obj.id || typeof obj.id !== 'string') {
    console.warn(`[${batchName}] Skipping item ${index}: missing or invalid id`);
    return false;
  }

  const exam = obj.exam as Record<string, unknown> | undefined;
  if (!exam || !exam.name || !exam.year) {
    console.warn(`[${batchName}] Skipping ${obj.id}: missing exam info`);
    return false;
  }

  const question = obj.question as Record<string, unknown> | undefined;
  if (!question || !question.text || !question.type || !Array.isArray(question.options) || question.options.length === 0) {
    console.warn(`[${batchName}] Skipping ${obj.id}: invalid question structure`);
    return false;
  }

  for (const opt of question.options as Record<string, unknown>[]) {
    if (!opt.label || !opt.text) {
      console.warn(`[${batchName}] Skipping ${obj.id}: option missing label or text`);
      return false;
    }
  }

  const answer = obj.answer as Record<string, unknown> | undefined;
  if (!answer || !answer.correctOption) {
    console.warn(`[${batchName}] Skipping ${obj.id}: missing answer info`);
    return false;
  }

  const correctOption = answer.correctOption;
  const validOptionLabels = (question.options as Record<string, unknown>[]).map((o) => o.label);

  // Support both single answer (string) and multiple correct (array)
  if (typeof correctOption === 'string') {
    if (!validOptionLabels.includes(correctOption)) {
      console.warn(`[${batchName}] Skipping ${obj.id}: correctOption does not match any option`);
      return false;
    }
  } else if (Array.isArray(correctOption)) {
    if (!correctOption.every((o) => validOptionLabels.includes(o))) {
      console.warn(`[${batchName}] Skipping ${obj.id}: some correctOptions do not match options`);
      return false;
    }
  } else {
    console.warn(`[${batchName}] Skipping ${obj.id}: invalid correctOption type`);
    return false;
  }

  if (!obj.classification || typeof obj.classification !== 'object') {
    console.warn(`[${batchName}] Skipping ${obj.id}: missing classification`);
    return false;
  }

  if (!obj.source || typeof obj.source !== 'object') {
    console.warn(`[${batchName}] Skipping ${obj.id}: missing source`);
    return false;
  }

  const source = obj.source as Record<string, unknown>;
  if (!VALID_SOURCE_TYPES.includes(source.type as typeof VALID_SOURCE_TYPES[number])) {
    console.warn(`[${batchName}] Skipping ${obj.id}: invalid source type "${source.type}"`);
    return false;
  }

  if (!obj.verification || typeof obj.verification !== 'object') {
    console.warn(`[${batchName}] Skipping ${obj.id}: missing verification`);
    return false;
  }

  return true;
}

function loadAndValidate(): Question[] {
  const validQuestions: Question[] = [];
  const seenIds = new Set<string>();

  for (let b = 0; b < allRawBatches.length; b++) {
    const batch = allRawBatches[b];
    const batchName = batch.length > 0
      ? `${(batch[0] as Record<string, unknown>).id || 'batch-' + b}`
      : `batch-${b}`;

    for (let i = 0; i < batch.length; i++) {
      const raw = batch[i];
      if (validateQuestion(raw, i, batchName)) {
        if (seenIds.has(raw.id)) {
          console.warn(`Skipping duplicate id: ${raw.id}`);
          continue;
        }
        seenIds.add(raw.id);
        validQuestions.push(raw);
      }
    }
  }

  return validQuestions;
}

let _questions: Question[] | null = null;

export function getQuestions(): Question[] {
  if (_questions === null) {
    _questions = loadAndValidate();
  }
  return _questions;
}
