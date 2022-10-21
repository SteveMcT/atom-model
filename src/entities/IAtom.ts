export default class IAtom {
  name: string;
  symbol: string;
  protons: number;
  size: number;

  constructor(props: { name: string; symbol: string; protons: number; size: number }) {
    this.name = props.name;
    this.symbol = props.symbol;
    this.protons = props.protons;
    this.size = props.size;
  }
}
