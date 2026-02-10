public sealed record Block
{
    public long Index { get; }

    public DateTime DateTime { get; } = DateTime.UtcNow;

    public IList<Transaction> Transactions { get; }

    public string PreviousHash { get; }

    public string Hash { get; private set; }

    public Block(Block previous, IList<Transaction> transactions)
    {
        Transactions = transactions;

        if (previous is not null)
        {
            Index = previous.Index + 1;

            PreviousHash = previous.Hash;
        }

        Hash = ComputeHash();
    }

    public void Mine(int difficulty)
    {
        var nonce = 0;

        while (nonce < difficulty)
        {
            Hash = ComputeHash();

            nonce++;
        }
    }

    public string ComputeHash()
    {
        var input = Encoding.Default.GetBytes($"{Index}{DateTime}{PreviousHash}{Transactions}");

        return Convert.ToBase64String(SHA256.HashData(input));
    }
}
