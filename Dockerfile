# ---- Build Stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies (layer cache friendly)
COPY API/API.csproj API/
RUN dotnet restore API/API.csproj

# Copy everything else and publish
COPY . .
WORKDIR /src/API
RUN dotnet publish API.csproj -c Release -o /app/publish --no-restore

# ---- Runtime Stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

# ASP.NET Core 8 defaults to port 8080 inside the container
ENV ASPNETCORE_HTTP_PORTS=8080

ENTRYPOINT ["dotnet", "API.dll"]
