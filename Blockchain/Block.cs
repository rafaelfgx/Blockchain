public sealed record Block
{
    public long Index { get; }

    public DateTime DateTime { get; } = DateTime.UtcNow;

    public IList<Transaction> Transactions { get; }

    public string PreviousHash { get; }

    public string Hash { get; private set; }

    public Block(Block previous, IList<Transaction> transactions)
    {
        Index = previous?.Index + 1 ?? 0;

        PreviousHash = previous?.Hash;

        Transactions = transactions;

        Hash = ComputeHash();
    }

    public void Mine(int difficulty)
    {
        for (var nonce = 0; nonce < difficulty; nonce++) Hash = ComputeHash();
    }

    public string ComputeHash()
    {
        return Convert.ToBase64String(SHA256.HashData(Encoding.Default.GetBytes($"{Index}{DateTime}{PreviousHash}{Transactions}")));
    }
}
