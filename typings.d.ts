export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'One size';

export interface ProductItem {
  id: string;
  title: string;
  price: number;
  sizes: Array<Size>;
  imgSource: string;
}
