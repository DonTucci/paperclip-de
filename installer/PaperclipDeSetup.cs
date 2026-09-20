using System;
using System.Diagnostics;
using System.IO;
using System.Text;

internal static class PaperclipDeSetup
{
    // Der Build ersetzt diesen Platzhalter durch install-de.ps1 als Base64-Text.
    private const string InstallScriptBase64 = "__SCRIPT_BASE64__";

    public static int Main(string[] args)
    {
        string scriptPath = Path.Combine(Path.GetTempPath(), "paperclip-de-install-" + Guid.NewGuid().ToString("N") + ".ps1");
        int exitCode = 1;
        Console.Title = "Paperclip auf Deutsch installieren";
        Console.WriteLine("========================================");
        Console.WriteLine(" Paperclip auf Deutsch installieren");
        Console.WriteLine("========================================");
        Console.WriteLine();
        Console.WriteLine("Das Fenster bleibt nach der Installation geöffnet.");
        Console.WriteLine("Bitte warten Sie, bis die Erfolgsmeldung erscheint.");
        Console.WriteLine();
        try
        {
            File.WriteAllText(
                scriptPath,
                Encoding.UTF8.GetString(Convert.FromBase64String(InstallScriptBase64)),
                new UTF8Encoding(false));

            string powershell = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.Windows),
                "System32\\WindowsPowerShell\\v1.0\\powershell.exe");
            string arguments = "-NoLogo -NoProfile -ExecutionPolicy Bypass -File " + Quote(scriptPath);
            foreach (string argument in args)
            {
                arguments += " " + Quote(argument);
            }

            ProcessStartInfo startInfo = new ProcessStartInfo
            {
                FileName = powershell,
                Arguments = arguments,
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                WorkingDirectory = Environment.CurrentDirectory
            };
            using (Process process = Process.Start(startInfo))
            {
                process.OutputDataReceived += (sender, eventArgs) =>
                {
                    if (eventArgs.Data != null) Console.WriteLine(eventArgs.Data);
                };
                process.ErrorDataReceived += (sender, eventArgs) =>
                {
                    if (eventArgs.Data != null) Console.Error.WriteLine(eventArgs.Data);
                };
                process.BeginOutputReadLine();
                process.BeginErrorReadLine();
                process.WaitForExit();
                process.WaitForExit();
                exitCode = process.ExitCode;
                Console.WriteLine();
                if (exitCode == 0)
                {
                    Console.WriteLine("Die Installation wurde erfolgreich abgeschlossen.");
                    Console.WriteLine("Die deutsche Version liegt unter %LOCALAPPDATA%\\Paperclip-DE.");
                    Console.WriteLine("Zum Starten: corepack pnpm@9.15.4 dev:once");
                }
                else
                {
                    Console.WriteLine("Die Installation ist fehlgeschlagen (Fehlercode " + exitCode + ").");
                    Console.WriteLine("Prüfen Sie die Meldung oben und versuchen Sie es erneut.");
                }
            }
        }
        catch (Exception error)
        {
            Console.WriteLine();
            Console.Error.WriteLine("Die Paperclip-Installation konnte nicht gestartet werden.");
            Console.Error.WriteLine(error.Message);
        }
        finally
        {
            try { if (File.Exists(scriptPath)) File.Delete(scriptPath); } catch { }
            if (!Console.IsInputRedirected)
            {
                Console.WriteLine();
                Console.Write("Zum Schliessen bitte Enter drücken ... ");
                Console.ReadLine();
            }
        }
        return exitCode;
    }

    private static string Quote(string value)
    {
        // Die Installationsparameter enthalten normale Windows-Pfade. Nur
        // Anführungszeichen müssen escaped werden; Backslashes bleiben intakt.
        return "\"" + value.Replace("\"", "\\\"") + "\"";
    }
}
