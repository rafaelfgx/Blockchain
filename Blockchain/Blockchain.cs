using System.Text.Json;
using System.Text.Json.Serialization;

namespace Blockchain;

public sealed record Blockchain
{
    public IList<Block> Chain { get; }

    public bool Valid
    {
        get
        {
            for (var i = 1; i < Chain.Count; i++)
            {
                var current = Chain[i];

                if (!current.Hash.Equals(current.ComputeHash())) return false;

                var previous = Chain[i - 1];

                if (!current.PreviousHash.Equals(previous.Hash)) return false;
            }

            return true;
        }
    }

    private int Difficulty { get; }

    private decimal Reward { get; }

    private IList<Transaction> Transactions { get; set; }

    public Blockchain(int difficulty, int reward)
    {
        Difficulty = difficulty;

        Reward = reward;

        Chain = new List<Block> { new(default, default) };

        Transactions = new List<Transaction>();
    }

    public void Add(Transaction transaction)
    {
        Console.WriteLine($"[TRANSACTION] From: {transaction.From} To: {transaction.To} Amount: {transaction.Amount}" + Environment.NewLine);

        Transactions.Add(transaction);
    }

    public void Mine(Guid address)
    {
        Console.WriteLine("[MINING STARTED]" + Environment.NewLine);

        Add(new Transaction(default, address, Reward));

        var block = new Block(Chain.Last(), Transactions);

        block.Mine(Difficulty);

        Console.WriteLine($"[MINING FINISHED] Hash: {block.Hash}" + Environment.NewLine);

        Chain.Add(block);

        Transactions = new List<Transaction>();
    }

    public override string ToString() => JsonSerializer.Serialize(this, new JsonSerializerOptions { WriteIndented = true, DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull });
}
