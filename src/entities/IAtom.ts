export default class IAtom {
  id: number;
  name: string;
  symbol: string;
  protons: number;
  size: number;

  constructor(props: { id: number; name: string; symbol: string; protons: number; size: number }) {
    this.id = props.id;
    this.name = props.name;
    this.symbol = props.symbol;
    this.protons = props.protons;
    this.size = props.size;
  }
}
