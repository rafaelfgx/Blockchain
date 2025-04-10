namespace Blockchain;

public class Program
{
    public static void Main()
    {
        var addressMiner = Guid.NewGuid();

        var address1 = Guid.NewGuid();

        var address2 = Guid.NewGuid();

        var address3 = Guid.NewGuid();

        var blockchain = new Blockchain(1000000, 1);

        blockchain.Add(new Transaction(address1, address2, 10));

        blockchain.Mine(addressMiner);

        blockchain.Add(new Transaction(address1, address3, 20));

        blockchain.Add(new Transaction(address2, address3, 30));

        blockchain.Mine(addressMiner);

        Console.WriteLine(blockchain + Environment.NewLine);

        #region Tampering Attempt

        Console.WriteLine("[TAMPERING ATTEMPT]" + Environment.NewLine);

        blockchain.Chain[1] = new Block(blockchain.Chain[0], new List<Transaction> { new(address1, addressMiner, 40) });

        Console.WriteLine(blockchain + Environment.NewLine);

        #endregion Tampering Attempt

        Console.ReadKey();
    }
}
