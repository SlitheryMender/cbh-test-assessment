const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns partitionKey when input contains key partitionKey and it is a string less than 256 chars", () => {
    const event = {
      partitionKey : Array(15).join("a")
    }
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(event.partitionKey);
  });

  it("Returns partitionKey when input contains key partitionKey and it is a string of length 255", () => {
    let randVal = Array(255).join("a")
    const event = {
      partitionKey : randVal
    }
    // let hashedvalue = crypto.createHash("sha3-512").update(data).digest("hex");
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(event.partitionKey);
  });

  it("Returns hashed value of partitionKey when input contains key partitionKey and it is a string greater than 256 chars", () => {
    let randVal = Array(300).join("a")
    const event = {
      partitionKey : randVal
    }
    let hashedvalue = crypto.createHash("sha3-512").update(randVal).digest("hex");
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(hashedvalue);
  });

  it("Returns stringified partitionKey when input contains non-string partitionKey and it's stringified length is less than 256", () => {
    const event = {
      partitionKey : {
        "somekey" : "randomvalue"
      }
    }
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(JSON.stringify(event.partitionKey));
  });

  it("Returns hashed value of stringified partitionKey when input contains non-string partitionKey and it's stringified length is greater than 256", () => {
    let randVal = Array(300).join("a")
    const event = {
      partitionKey : {
        "somekey" : randVal
      }
    }
    let hashedvalue = crypto.createHash("sha3-512").update(JSON.stringify(event.partitionKey)).digest("hex");
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(hashedvalue);
  });

  it("Returns hashed value of input when input does not contain the key partitionKey and input is a string", () => {
    let randVal = Array(100).join("a")
    const event = randVal
    let hashedvalue = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(hashedvalue);
  });

  it("Returns hashed value of input when input does not contain the key partitionKey and input is string whose length is > 256", () => {
    let randVal = Array(300).join("a")
    const event = randVal
    let hashedvalue = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(hashedvalue);
  });

  it("Returns hashed value of input when input does not contain the key partitionKey and input is non-string whose stringified length is < 256", () => {
    let randVal = Array(100).join("a")
    const event = {
      "somekey" : randVal
    }
    let hashedvalue = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(hashedvalue);
  });

  it("Returns hashed value of input when input does not contain the key partitionKey and input is non-string whose stringified length is > 256", () => {
    let randVal = Array(300).join("a")
    const event = {
      "somekey" : randVal
    }
    let hashedvalue = crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex");
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(hashedvalue);
  });

  // it("Returns the literal '0' when given no input", () => {
  //   const trivialKey = deterministicPartitionKey();
  //   expect(trivialKey).toBe("0");
  // });

  // it("Returns the literal '0' when given no input", () => {
  //   const trivialKey = deterministicPartitionKey();
  //   expect(trivialKey).toBe("0");
  // });
});
