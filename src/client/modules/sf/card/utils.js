/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

export function isNarrow(variant) {
  return typeof variant === 'string' && variant.toLowerCase() === 'narrow';
}

export function isBase(variant) {
  return typeof variant === 'string' && variant.toLowerCase() === 'base';
}