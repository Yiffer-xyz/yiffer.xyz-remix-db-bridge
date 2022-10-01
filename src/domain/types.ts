// Consider moving types into their own domain folders instead of all in one.
// Can consider later, if this one gets too large.

export interface Comic {
  id: number;
  name: string;
  artistId: number;
  category: 'Furry' | 'MLP' | 'Pokemon' | 'Other';
  classification: 'M' | 'F' | 'MF' | 'MM' | 'FF' | 'MF+' | 'I';
  state: 'wip' | 'finished' | 'cancelled';
  numberOfPages: number;
  created: string;
  updated: string;
}
