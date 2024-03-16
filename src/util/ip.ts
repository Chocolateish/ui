export type IPType = "IPV4" | "IPV6";

export type IPV4 = [bigint, bigint, bigint, bigint];
export type IPV6BigInt = [
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint
];
export type IPV6String = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

type IPTypeMap = {
  IPV4: IPV4;
  IPV6: IPV6BigInt;
};
type IPTypeMapConstructor = {
  IPV4: IPV4 | bigint | string | Number;
  IPV6: IPV6BigInt | IPV6String | string | bigint;
};

export class IP<T extends IPType> {
  readonly type: T;
  //@ts-expect-error
  readonly ip: IPTypeMap[T];

  constructor(type: T, ip: IPTypeMapConstructor[T]) {
    this.type = type;
    switch (typeof ip) {
      case "bigint":
        if (type === "IPV4") this.ip = IP.bigintToIpv4(ip) as IPTypeMap[T];
        else this.ip = IP.bigintToIpv6(ip) as IPTypeMap[T];
        break;
      case "number":
        if (type === "IPV4") this.ip = IP.numberToIpv4(ip) as IPTypeMap[T];
        break;
      case "string":
        if (type === "IPV4") this.ip = IP.stringToipv4(ip) as IPTypeMap[T];
        else this.ip = IP.stringToipv6(ip) as IPTypeMap[T];
        break;
      case "object":
        if (type === "IPV4") this.ip = ip as IPTypeMap[T];
        else {
          if (typeof (ip as IPV6String)[0] === "string") {
            this.ip = IP.ipv6StringToipv6(ip as IPV6String) as IPTypeMap[T];
          } else {
            this.ip = ip as IPTypeMap[T];
          }
        }
        break;
    }
  }

  toString(): string {
    return this.ip.join(".");
  }

  toNumber(): bigint {
    if (this.type === "IPV4") return IP.ipv4ToBigInt(this.ip as IPV4);
    else return IP.ipv6ToBigInt(this.ip as IPV6BigInt);
  }

  /**Converts an ipv4 number struct to a single bigint */
  static ipv4ToNumber(ip: IPV4): number {
    return Number(IP.ipv4ToBigInt(ip));
  }
  /**Converts an ipv4 number struct to a single bigint */
  static ipv4ToBigInt(ip: IPV4): bigint {
    return ip.reduce((acc, cur) => (acc << 8n) + BigInt(cur), 0n);
  }
  /**Converts an ipv4 number struct to a hexadecimal string */
  static ipv4ToHex(ip: IPV4): string {
    return IP.ipv4ToBigInt(ip).toString(16);
  }
  /**Converts an ipv4 number struct to a string */
  static ipv4ToString(ip: IPV4): string {
    return ip.join(".");
  }

  /**Converts an ipv6 number struct to a single bigint */
  static ipv6ToBigInt(ip: IPV6BigInt): bigint {
    return ip.reduce((acc, cur) => (acc << 16n) + BigInt(cur), 0n);
  }
  /**Converts an ipv6 number struct to a hexadecimal string */
  static ipv6ToHex(ip: IPV4): string {
    return IP.ipv4ToBigInt(ip).toString(16);
  }
  /**Converts an ipv6 number struct to a base 36 string, the shortest possible */
  static ipv6ToShortest(ip: IPV4): string {
    return IP.ipv4ToBigInt(ip).toString(16);
  }
  /**Converts an ipv6 number struct to a string */
  static ipv6ToString(ip: IPV6BigInt): string {
    return ip.map((v) => v.toString(16).padStart(4, "0")).join(":");
  }

  /**Converts a number to a ipv4 */
  static numberToIpv4(ip: number): IPV4 {
    return IP.bigintToIpv4(BigInt(ip));
  }

  /**Converts a bigint to a ipv4 */
  static bigintToIpv4(ip: bigint): IPV4 {
    return [
      (ip >> 24n) & 255n,
      (ip >> 16n) & 255n,
      (ip >> 8n) & 255n,
      ip & 255n,
    ];
  }

  /**Converts a bigint to a ipv6 */
  static bigintToIpv6(ip: bigint): IPV6BigInt {
    return [
      (ip >> 112n) & 65535n,
      (ip >> 96n) & 65535n,
      (ip >> 80n) & 65535n,
      (ip >> 64n) & 65535n,
      (ip >> 48n) & 65535n,
      (ip >> 32n) & 65535n,
      (ip >> 16n) & 65535n,
      ip & 65535n,
    ];
  }

  /**Converts a string to a ipv4 */
  static stringToipv4(ip: string): IPV4 {
    return ip.split(".").map((v) => BigInt(v) & 255n) as IPV4;
  }

  /**Converts a string to a ipv6 */
  static stringToipv6(ip: string): IPV6BigInt {
    let split = ip.split(":").map((v) => BigInt(parseInt(v, 16)));
    return split.concat(new Array(8 - split.length).fill(0n)) as IPV6BigInt;
  }

  /**Converts a ipv6 string to a ipv6 */
  static ipv6StringToipv6(ip: IPV6String): IPV6BigInt {
    return ip.map((v) => BigInt(parseInt(v, 16))) as IPV6BigInt;
  }

  static isIPv4(ip: string): boolean {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
  }

  static isIPv6(ip: string): boolean {
    return /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/.test(ip);
  }

  static isIP(ip: string): boolean {
    return IP.isIPv4(ip) || IP.isIPv6(ip);
  }
}
