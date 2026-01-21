public sealed record Blockchain
{
    public IList<Block> Blocks { get; } = [new(default, default)];

    private IList<Transaction> Transactions = [];

    private readonly int Difficulty = 2_500_000;

    private readonly int Reward = 1;

    public bool Valid
    {
        get
        {
            for (var i = 1; i < Blocks.Count; i++)
            {
                var current = Blocks[i];

                if (!current.Hash.Equals(current.ComputeHash())) return false;

                var previous = Blocks[i - 1];

                if (!current.PreviousHash.Equals(previous.Hash)) return false;
            }

            return true;
        }
    }

    public void Add(Transaction transaction)
    {
        Transactions.Add(transaction);

        Console.WriteLine($"[TRANSACTION] From: {transaction.From} To: {transaction.To} Amount: {transaction.Amount}" + Environment.NewLine);
    }

    public void Mine(Guid address)
    {
        Console.WriteLine("[MINING STARTED]" + Environment.NewLine);

        Add(new(Guid.Empty, address, Reward));

        var block = new Block(Blocks.Last(), Transactions);

        block.Mine(Difficulty);

        Blocks.Add(block);

        Transactions = [];

        Console.WriteLine($"[MINING FINISHED] Hash: {block.Hash}" + Environment.NewLine);
    }

    public override string ToString() => JsonSerializer.Serialize(this);
}
