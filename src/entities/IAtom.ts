export default class IAtom {
  name: string;
  symbol: string;
  nucleons: number;
  size: number;

  constructor(props: { name: string; symbol: string; nucleons: number; size: number }) {
    this.name = props.name;
    this.symbol = props.symbol;
    this.nucleons = props.nucleons;
    this.size = props.size;
  }
}
