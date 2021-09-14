interface RibbonDataType {
  domain: {
    from: Date;
    to: Date;
  };
  states: [
    {
      from: Date;
      to: Date;
      description: string;
      color: string;
    }
  ];
}
interface Bar {
  label: string;
  x: number;
  period: { from: Date; to: Date };
  from: string;
  to: string;
  width: number;
  height: number;
  duration: string;
  fill: string;
}

export { Bar, RibbonDataType };
