package com.foodplatform.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {



        //  Check if the request has an Authorization header
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;
        System.out.println("Processing Auth Header: " + authHeader);

        // If no header or doesn't start with "Bearer ", skip this filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No Bearer token found. Proceeding as Anonymous.");
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extract the token (Remove "Bearer " prefix)
        jwt = authHeader.substring(7);

        //  Extract username from token
        // (If extraction fails, JwtUtil will throw an error, handling is implicit for now)
        username = jwtUtil.extractUsername(jwt);

        //  If username exists AND the user is not already authenticated in this context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load user details from the Database (via our custom service)
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            System.out.println("User Authenticated Successfully: " + username);
            //  Validate the token
            if (jwtUtil.isTokenValid(jwt, userDetails)) {

                //  Create an Authentication Token (The "Pass")
                // This object tells Spring Security: "This user is authenticated, here are their authorities."
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // credentials (we don't keep the password)
                        userDetails.getAuthorities()
                );

                // Add details about the request (IP address, Session ID, etc.)
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                //  Update the SecurityContext (The "VIP List")
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            else{
                System.out.println("Token Validation Failed!");
            }
        }

        // 8. Continue the filter chain
        filterChain.doFilter(request, response);
    }
}
