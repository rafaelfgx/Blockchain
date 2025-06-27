namespace Blockchain;

public sealed record Transaction(Guid From, Guid To, decimal Amount);
