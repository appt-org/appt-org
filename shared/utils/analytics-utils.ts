import { analyticsEnabled } from 'shared/utils/env';

export type GtmEvent = 'scroll' | 'menu_click' | 'content_block_click' | 'language_switch';
export type GtmParameter =
  | 'scroll_percentage'
  | 'menu_name'
  | 'menu_item_name'
  | 'menu_item_url'
  | 'menu_action'
  | 'block_name'
  | 'block_item_name'
  | 'block_item_url'
  | 'language_old'
  | 'language_new';
export type GtmParameters = Partial<Record<GtmParameter, unknown>>;

export type BaseGtmEvent = {
  event: GtmEvent;
} & GtmParameters;

export function logEvent(event: BaseGtmEvent) {
  if (!analyticsEnabled()) {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  window.dataLayer.push(event);
}
