import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link2, Copy, Trash2, Zap, Shield, Code, ExternalLink } from "lucide-react";

interface ShortenedUrl {
  id: string;
  shortUrl: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
}

interface ShortenResponse {
  shortUrl: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch recent URI
  const { data: recentUrls, isLoading: urlsLoading } = useQuery<ShortenedUrl[]>({
    queryKey: ["/api/urls"],
    enabled: false, // Temporarily disable this to test if it's causing issues
  });

  // Shorten URL mutation
  const shortenMutation = useMutation({
    mutationFn: async (longUrl: string) => {
      const res = await apiRequest("POST", "/api/shorten", { url: longUrl });
      return res.json();
    },
    onSuccess: (data: ShortenResponse) => {
      setResult(data);
      setUrl("");
      queryClient.invalidateQueries({ queryKey: ["/api/urls"] });
      toast({
        title: "URL shortened successfully!",
        description: "Your short URL is ready to use.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to shorten URL",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    shortenMutation.mutate(url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "URL copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="bg-background font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Link2 className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">LinkShort</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
                Home
              </a>
              <a href="#api-docs" className="text-gray-600 hover:text-gray-900 font-medium">
                API Docs
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Shorten Your URLs Instantly</h2>
          <p className="text-xl text-gray-600 mb-8">
            Transform long, unwieldy URLs into short, shareable links. Fast, reliable, and completely free.
          </p>

          {/* URL Shortening Form */}
          <Card className="bg-gray-50 rounded-2xl shadow-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="long-url" className="sr-only">
                      Enter your long URL
                    </Label>
                    <Input
                      id="long-url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/your-very-long-url-here"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-500"
                      required
                      data-testid="input-long-url"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={shortenMutation.isPending}
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap"
                    data-testid="button-shorten"
                  >
                    {shortenMutation.isPending ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Shorten URL
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* URL Result */}
              {result && (
                <div className="mt-6 p-4 bg-white rounded-lg border" data-testid="url-result">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Your shortened URL:
                      </Label>
                      <div className="flex items-center space-x-3">
                        <Input
                          type="text"
                          value={result.shortUrl}
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-primary font-mono text-sm"
                          readOnly
                          data-testid="input-shortened-url"
                        />
                        <Button
                          onClick={() => copyToClipboard(result.shortUrl)}
                          variant="outline"
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          data-testid="button-copy"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* URL Details */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Original URL:</span>
                        <p className="text-gray-900 truncate font-mono" data-testid="text-original-url">
                          {result.originalUrl}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Short Code:</span>
                        <p className="text-gray-900 font-mono" data-testid="text-short-code">
                          {result.shortCode}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <p className="text-gray-900" data-testid="text-created-time">
                          {formatTimeAgo(result.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LinkShort?</h3>
            <p className="text-lg text-gray-600">Simple, fast, and reliable URL shortening service</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white rounded-xl shadow-sm text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h4>
                <p className="text-gray-600">
                  Generate short URLs instantly with our optimized backend infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h4>
                <p className="text-gray-600">
                  All URLs are validated and securely stored with 99.9% uptime guarantee.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500 bg-opacity-10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Code className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Developer Friendly</h4>
                <p className="text-gray-600">
                  RESTful API with comprehensive documentation for easy integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-16 bg-white" id="api-docs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h3>
            <p className="text-lg text-gray-600">Integrate URL shortening into your applications</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* POST Endpoint */}
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">
                    POST
                  </span>
                  <code className="text-sm font-mono text-gray-700">/api/shorten</code>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Shorten URL</h4>
                <p className="text-gray-600 mb-4">Create a shortened URL from a long URL</p>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Request Body:</h5>
                    <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{`{
  "url": "https://example.com/very-long-url"
}`}</code>
                    </pre>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Response:</h5>
                    <pre className="bg-gray-800 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <code>{`{
  "shortUrl": "https://linkshort.co/abc123",
  "originalUrl": "https://example.com/very-long-url",
  "shortCode": "abc123",
  "createdAt": "2024-01-15T10:30:00Z"
}`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GET Endpoint */}
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded">
                    GET
                  </span>
                  <code className="text-sm font-mono text-gray-700">/{"{shortCode}"}</code>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Redirect to Original URL</h4>
                <p className="text-gray-600 mb-4">
                  Redirect users to the original URL using the short code
                </p>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Parameters:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        <code className="bg-gray-200 px-2 py-1 rounded text-xs">shortCode</code> - The
                        6-8 character short code
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Response:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        <strong>301/302 Redirect</strong> - Redirects to original URL
                      </li>
                      <li>
                        <strong>404 Not Found</strong> - Short code doesn't exist
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Errors Handling */}
          <Card className="mt-8 bg-red-50 border border-red-200">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                Error Handling
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-semibold text-red-700 mb-2">400 Bad Request</h5>
                  <pre className="bg-red-800 text-red-100 p-3 rounded text-sm overflow-x-auto">
                    <code>{`{
  "error": "Invalid URL format",
  "message": "Please provide a valid URL"
}`}</code>
                  </pre>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-red-700 mb-2">404 Not Found</h5>
                  <pre className="bg-red-800 text-red-100 p-3 rounded text-sm overflow-x-auto">
                    <code>{`{
  "error": "Short URL not found",
  "message": "The requested short code does not exist"
}`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent URLs */}
      {recentUrls && recentUrls.length > 0 && (
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Recent Shortened URLs
            </h3>

            <Card className="bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Short URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Original URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUrls.slice(0, 10).map((url) => (
                      <tr key={url.id} className="hover:bg-gray-50" data-testid={`row-url-${url.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={url.shortUrl}
                            className="text-primary font-mono text-sm hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={`link-short-url-${url.id}`}
                          >
                            {url.shortUrl.replace(/^https?:\/\//, "")}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="text-sm text-gray-900 truncate max-w-xs"
                            title={url.originalUrl}
                            data-testid={`text-original-url-${url.id}`}
                          >
                            {url.originalUrl}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-testid={`text-created-${url.id}`}>
                          {formatTimeAgo(url.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(url.shortUrl)}
                            className="text-primary hover:text-blue-600 mr-3"
                            data-testid={`button-copy-${url.id}`}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Link2 className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">LinkShort</h3>
              </div>
              <p className="text-gray-600 mb-4">
                The fastest and most reliable URL shortening service. Simple, secure, and completely
                free to use.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#api-docs" className="text-gray-600 hover:text-gray-900">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Status Page
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">© 2024 LinkShort. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
