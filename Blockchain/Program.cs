var miner = Guid.NewGuid();

var address1 = Guid.NewGuid();
var address2 = Guid.NewGuid();
var address3 = Guid.NewGuid();

var blockchain = new Blockchain();

blockchain.Add(new(address1, address2, 10));
blockchain.Mine(miner);

blockchain.Add(new(address1, address3, 20));
blockchain.Add(new(address2, address3, 30));
blockchain.Mine(miner);

Console.WriteLine($"{blockchain}{Environment.NewLine}");

#region Tampering Attempt

Console.WriteLine("[TAMPERING ATTEMPT]\n");

blockchain.Blocks[1] = new(blockchain.Blocks[0], [new(address1, miner, 40)]);

Console.WriteLine($"{blockchain}{Environment.NewLine}");

#endregion

Console.ReadKey();
